import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert, Box, Button, Card, Dialog, DialogActions, DialogContent,
  DialogTitle, IconButton, Stack, Table, TableBody, TableCell, TableHead,
  TableRow, TextField, Tooltip, Typography, CircularProgress, Chip, MenuItem, TableSortLabel,
} from '@mui/material';
import { Add, Delete, Edit, Refresh, Search, ListAlt, ChevronLeft, ChevronRight } from '@mui/icons-material';
import { invalidatePlantData } from '../../hooks/usePlantData';
import { useAuth } from '../../contexts/AuthContext';
import { canDo, hasPermission } from '../../utils/permissions';
import { getErrorMessage } from '../../services/api';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { MdTune } from 'react-icons/md';
import PageHero from '../ui/PageHero';
import IconOrb from '../ui/IconOrb';
import Loader3D from '../ui/Loader3D';
import { sidebarMenu } from '../../constants/sidebarMenu';

const defaultNormalize = (value) => value || [];

// Look up the section + icon for a page title from the sidebar config (visual only)
const findHeroMeta = (title) => {
  for (const section of sidebarMenu) {
    const item = section.items.find((i) => i.title === title);
    if (item) return { section: section.section, icon: item.icon };
  }
  return { section: 'Management', icon: MdTune };
};

const ResourcePage = ({
  title, subtitle, service, columns, fields, initialValues = {},
  normalize = defaultNormalize, searchKeys = [], searchPlaceholder = 'Search...',
  deleteMessage = 'This action cannot be undone.',
  omitOnEdit = [],
  omitOnCreate = [],
  toPayload = (value, configuredFields, mode) => Object.fromEntries(configuredFields
    .filter((field) => (mode !== 'edit' || !omitOnEdit.includes(field.name))
      && (mode !== 'create' || !omitOnCreate.includes(field.name)))
    .map((field) => {
      let fieldValue = value[field.name];
      if (field.coerce === 'number' && fieldValue !== '') fieldValue = Number(fieldValue);
      if (field.coerce === 'boolean') fieldValue = fieldValue === true || fieldValue === 'true';
      return [field.name, fieldValue];
    })),
  filterOptions = null, filterKey = 'id', writeRoles = ['SUPER_ADMIN'],
  resource = null, scopeFilter = null,
  rowFilter = null, toolbarExtra = null, beforeTable = null, pageSize = 25, defaultSort = null, refreshToken = 0,
}) => {
  const { user } = useAuth();
  const reduceMotion = useReducedMotion();
  const heroMeta = findHeroMeta(title);
  const HeroIcon = heroMeta.icon;
  // Role-based actions: when a `resource` is given, the access matrix decides each action
  // separately; otherwise fall back to the original all-or-nothing writeRoles check.
  const legacyWrite = Boolean(user && (!writeRoles || (hasPermission(user, 'canCreate')
    && writeRoles.includes(user.role))));
  const canCreate = resource ? canDo(user, resource, 'create') : legacyWrite;
  const canEdit = resource ? canDo(user, resource, 'edit') : legacyWrite;
  const canDelete = resource ? canDo(user, resource, 'delete') : legacyWrite;
  const canWrite = canEdit || canDelete;
  const { list, create, update, remove: removeItem } = service;
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('');
  const [dialog, setDialog] = useState(null);
  const [form, setForm] = useState(initialValues);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [sort, setSort] = useState(defaultSort);
  const [page, setPage] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setRows(normalize(await list()));
    } catch (loadError) {
      setError(getErrorMessage(loadError, `Unable to load ${title.toLowerCase()}.`));
    } finally {
      setLoading(false);
    }
  }, [list, normalize, title]);

  useEffect(() => {
    const timer = setTimeout(() => { load(); }, 0);
    return () => clearTimeout(timer);
  }, [load, refreshToken]);

  // Department-scoped roles only ever see their own department's rows
  const visibleRows = useMemo(() => (scopeFilter ? rows.filter(scopeFilter) : rows), [rows, scopeFilter]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return visibleRows.filter((row) => (!needle || searchKeys.some((key) => String(row[key] ?? '').toLowerCase().includes(needle)))
      && (!filter || String(row[filterKey]) === String(filter))
      && (!rowFilter || rowFilter(row)));
  }, [filter, filterKey, query, visibleRows, searchKeys, rowFilter]);

  // Click a column header to sort; numbers sort numerically, text alphabetically
  const sorted = useMemo(() => {
    if (!sort?.key) return filtered;
    const col = columns.find((c) => c.key === sort.key);
    const value = (row) => (col?.sortValue ? col.sortValue(row) : row[sort.key]);
    const dir = sort.dir === 'desc' ? -1 : 1;
    return [...filtered].sort((a, b) => {
      const va = value(a);
      const vb = value(b);
      if (va == null && vb == null) return 0;
      if (va == null) return 1;
      if (vb == null) return -1;
      if (typeof va === 'number' && typeof vb === 'number') return (va - vb) * dir;
      return String(va).localeCompare(String(vb), undefined, { numeric: true }) * dir;
    });
  }, [filtered, sort, columns]);

  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
  const currentPage = Math.min(page, pageCount - 1);
  const paged = sorted.slice(currentPage * pageSize, currentPage * pageSize + pageSize);
  const toggleSort = (key) => setSort((s) => (s?.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }));
  const singularTitle = title.endsWith('ies') ? `${title.slice(0, -3)}y` : title.endsWith('s') ? title.slice(0, -1) : title;

  const openCreate = () => {
    setForm({ ...initialValues });
    setFormError('');
    setDialog({ mode: 'create' });
  };
  const openEdit = (row) => {
    setForm({ ...row });
    setFormError('');
    setDialog({ mode: 'edit', row });
  };
  const closeDialog = () => { setDialog(null); setFormError(''); };
  
  const save = async () => {
    const included = (field) => (dialog.mode !== 'edit' || !omitOnEdit.includes(field.name))
      && (dialog.mode !== 'create' || !omitOnCreate.includes(field.name));
    const missing = fields.find((field) => included(field) && field.required && !String(form[field.name] ?? '').trim());
    if (missing) {
      setFormError(`${missing.label} is required.`);
      return;
    }
    const emailField = fields.find((field) => included(field) && field.type === 'email');
    if (emailField && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form[emailField.name] || '')) {
      setFormError(`${emailField.label} must be a valid email address.`);
      return;
    }
    const invalidNumber = fields.find((field) => included(field) && field.type === 'number' && !Number.isFinite(Number(form[field.name])));
    if (invalidNumber) {
      setFormError(`${invalidNumber.label} must be a valid number.`);
      return;
    }
    const outOfRange = fields.find((field) => included(field) && field.type === 'number' && form[field.name] !== '' && form[field.name] != null
      && ((field.min != null && Number(form[field.name]) < field.min) || (field.max != null && Number(form[field.name]) > field.max)));
    if (outOfRange) {
      const { min, max, label } = outOfRange;
      setFormError(min != null && max != null ? `${label} must be between ${min} and ${max}.` : min != null ? `${label} cannot be less than ${min}.` : `${label} cannot be more than ${max}.`);
      return;
    }
    try {
      setSaving(true);
      const payload = toPayload(form, fields, dialog.mode);
      if (dialog.mode === 'edit') await update(dialog.row.id, payload);
      else await create(payload);
      closeDialog();
      setNotice(`${singularTitle} saved successfully.`);
      invalidatePlantData();
      await load();
    } catch (saveError) {
      setFormError(getErrorMessage(saveError, 'Unable to save changes.'));
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    try {
      setDeleting(true);
      await removeItem(dialog.row.id);
      closeDialog();
      setNotice(`${singularTitle} deleted successfully.`);
      invalidatePlantData();
      await load();
    } catch (removeError) {
      setError(getErrorMessage(removeError, 'Unable to delete this record.'));
      closeDialog();
    } finally {
      setDeleting(false);
    }
  };

  const statusTone = (val) => {
    const v = String(val).toUpperCase();
    if (['ACTIVE', 'OPERATIONAL', 'NORMAL', 'GENERATED', 'COMPLETED', 'YES'].includes(v)) return { bg: 'rgba(5,150,105,0.10)', fg: 'var(--color-primary-green)', dot: '#059669', border: 'rgba(5,150,105,0.22)' };
    if (['WARNING', 'MAINTENANCE', 'PENDING'].includes(v)) return { bg: 'rgba(217,119,6,0.10)', fg: '#B45309', dot: '#D97706', border: 'rgba(217,119,6,0.25)' };
    if (['CRITICAL', 'LOCKED', 'FAILED', 'HIGH'].includes(v)) return { bg: 'rgba(220,38,38,0.08)', fg: '#B91C1C', dot: '#DC2626', border: 'rgba(220,38,38,0.22)' };
    return { bg: 'rgba(15,23,42,0.05)', fg: 'var(--color-text-secondary)', dot: '#94A3B8', border: 'rgba(15,23,42,0.08)' };
  };

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', pb: 4 }}>
      <PageHero
        eyebrow={heroMeta.section}
        title={title}
        subtitle={subtitle}
        icon={<HeroIcon />}
        actions={canCreate && (
          <Button
            variant="contained"
            onClick={openCreate}
            startIcon={<Add />}
            sx={{ height: 46, px: 2.25, minWidth: { xs: '100%', sm: 150 } }}
          >
            Add {singularTitle}
          </Button>
        )}
      />

      <AnimatePresence>
        {notice && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            <Alert severity="success" onClose={() => setNotice('')} sx={{ mb: 3 }}>{notice}</Alert>
          </motion.div>
        )}
        {error && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            <Alert severity="error" action={<Button color="inherit" size="small" onClick={load}>Retry</Button>} sx={{ mb: 3 }}>{error}</Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {beforeTable}

      {/* Data Section */}
      <Card sx={{ width: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Toolbar */}
        <Box sx={{ px: { xs: 2, sm: 2.5 }, py: 2, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 1.5, alignItems: 'center', borderBottom: '1px solid var(--color-border)', background: 'linear-gradient(180deg, rgba(255,255,255,0.9), rgba(246,248,250,0.6))' }}>
          <Box sx={{ flex: 1, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', gap: 1.5, width: '100%' }}>
            <TextField
              placeholder={searchPlaceholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              sx={{ flexGrow: 1, width: '100%', maxWidth: { md: 440 }, '& .MuiOutlinedInput-root': { minHeight: 44 } }}
              slotProps={{ input: { startAdornment: <Search sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} /> } }}
            />
            {filterOptions && (
              <TextField
                select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                slotProps={{ select: { displayEmpty: true } }}
                sx={{ width: { xs: '100%', sm: 200 }, '& .MuiOutlinedInput-root': { minHeight: 44 } }}
              >
                <MenuItem value="">All {title}</MenuItem>
                {filterOptions.map((opt) => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
              </TextField>
            )}
            {toolbarExtra}
          </Box>
          <Stack direction="row" sx={{ gap: 1.25, alignItems: "center", alignSelf: { xs: 'stretch', md: 'center' }, justifyContent: 'space-between' }}>
            {!loading && (
              <Chip
                size="small"
                label={`${filtered.length} of ${visibleRows.length}`}
                sx={{ height: 28, px: 0.5, bgcolor: 'var(--color-soft-green)', color: 'var(--color-primary-green)', fontWeight: 700, border: '1px solid rgba(4,120,87,0.15)' }}
              />
            )}
            <Tooltip title={`Refresh ${title}`}>
              <span>
                <IconButton onClick={load} disabled={loading} aria-label={`Refresh ${title}`} sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: '#FFFFFF', border: '1px solid var(--color-border)', boxShadow: '0 2px 0 rgba(15,23,42,0.04)', color: 'var(--color-primary-green)', '&:hover': { bgcolor: 'var(--color-soft-green)', transform: 'translateY(-2px)', boxShadow: '0 8px 16px -6px rgba(6,78,59,0.25)' }, '&:hover svg': { transform: 'rotate(180deg)' } }}>
                  <Refresh fontSize="small" sx={{ transition: 'transform 400ms ease' }} />
                </IconButton>
              </span>
            </Tooltip>
          </Stack>
        </Box>

        {/* Table Content */}
        <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column', width: '100%' }}>
          {loading ? (
            <Loader3D label={`Loading ${title.toLowerCase()}...`} minHeight={260} size={36} />
          ) : filtered.length === 0 ? (
            <Box sx={{ py: 8, px: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
              <Box sx={{ perspective: 400, mb: 2.5 }}>
                <IconOrb size={60} tone="#6EE7B7"><ListAlt /></IconOrb>
              </Box>
              <Typography variant="h3" sx={{ mb: 0.5 }}>No {title.toLowerCase()} found</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>We couldn't find anything matching your criteria.</Typography>
              {canCreate && <Button variant="outlined" startIcon={<Add />} onClick={openCreate}>Create first {singularTitle.toLowerCase()}</Button>}
            </Box>
          ) : (
            <Box sx={{ overflowX: 'auto', flexGrow: 1, width: '100%' }}>
              <Table sx={{ minWidth: 800, width: '100%' }}>
                <TableHead>
                  <TableRow>
                    {columns.map((col) => (
                      <TableCell key={col.key} sortDirection={sort?.key === col.key ? sort.dir : false}>
                        {col.sortable === false ? col.label : (
                          <TableSortLabel active={sort?.key === col.key} direction={sort?.key === col.key ? sort.dir : 'asc'} onClick={() => toggleSort(col.key)}>
                            {col.label}
                          </TableSortLabel>
                        )}
                      </TableCell>
                    ))}
                    {canWrite && <TableCell align="right">Actions</TableCell>}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paged.map((row, index) => (
                    <TableRow
                      hover
                      key={row.id}
                      component={motion.tr}
                      initial={reduceMotion ? false : { opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2, delay: Math.min(index, 8) * 0.015 }}
                      sx={{ '&:hover .gs-row-actions': { opacity: 1 } }}
                    >
                      {columns.map((col) => {
                        const val = col.render ? col.render(row) : (row[col.key] ?? '-');
                        const isNum = typeof row[col.key] === 'number' || ['cox', 'nox', 'sox', 'pm', 'flyAsh', 'temperature', 'efficiency', 'healthScore'].includes(col.key);
                        const isStatus = col.key === 'status' || col.label.toLowerCase() === 'status';
                        const isLast = index === paged.length - 1;
                        const tone = isStatus ? statusTone(val) : null;

                        return (
                          <TableCell key={col.key} align={isNum ? 'right' : 'left'} sx={{ fontWeight: isNum ? 650 : 450, fontFamily: isNum ? '"JetBrains Mono", ui-monospace, monospace' : 'inherit', fontVariantNumeric: 'tabular-nums', fontSize: isNum ? 13.5 : 14.5, color: 'var(--color-text-main)', whiteSpace: col.key === 'description' ? 'normal' : 'nowrap', borderBottom: isLast ? 'none' : '1px solid var(--color-border)' }}>
                            {isStatus ? (
                              <Chip
                                size="small"
                                label={String(val)}
                                icon={<Box component="span" sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: tone.dot, ml: '8px !important', mr: '-2px !important' }} />}
                                sx={{ height: 26, fontSize: 11.5, fontWeight: 700, bgcolor: tone.bg, color: tone.fg, border: `1px solid ${tone.border}` }}
                              />
                            ) : val}
                          </TableCell>
                        );
                      })}
                      {canWrite && (
                        <TableCell align="right" sx={{ borderBottom: index === paged.length - 1 ? 'none' : '1px solid var(--color-border)' }}>
                          <Stack direction="row" spacing={0.75} className="gs-row-actions" sx={{ justifyContent: "flex-end", opacity: { xs: 1, md: 0.55 }, transition: 'opacity 160ms ease' }}>
                            {canEdit && (
                            <Tooltip title="Edit">
                              <IconButton onClick={() => openEdit(row)} size="small" aria-label="Edit" sx={{ width: 34, height: 34, borderRadius: '10px', bgcolor: '#FFFFFF', border: '1px solid var(--color-border)', color: 'var(--color-primary-green)', '&:hover': { bgcolor: 'var(--color-soft-green)', transform: 'translateY(-2px)', boxShadow: '0 6px 12px -4px rgba(6,78,59,0.25)' } }}><Edit sx={{ fontSize: 17 }} /></IconButton>
                            </Tooltip>
                            )}
                            {canDelete && (
                            <Tooltip title="Delete">
                              <IconButton onClick={() => setDialog({ mode: 'delete', row })} size="small" aria-label="Delete" sx={{ width: 34, height: 34, borderRadius: '10px', bgcolor: '#FFFFFF', border: '1px solid var(--color-border)', color: 'var(--color-error)', '&:hover': { bgcolor: '#FEF2F2', borderColor: 'rgba(220,38,38,0.3)', transform: 'translateY(-2px)', boxShadow: '0 6px 12px -4px rgba(220,38,38,0.3)' } }}><Delete sx={{ fontSize: 17 }} /></IconButton>
                            </Tooltip>
                            )}
                          </Stack>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {sorted.length > pageSize && (
                <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', px: 2.5, py: 1.5, borderTop: '1px solid var(--color-border)' }}>
                  <Typography variant="body2">
                    Showing {currentPage * pageSize + 1}–{Math.min(sorted.length, (currentPage + 1) * pageSize)} of {sorted.length}
                  </Typography>
                  <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
                    <IconButton size="small" aria-label="Previous page" disabled={currentPage === 0} onClick={() => setPage(currentPage - 1)} sx={{ border: '1px solid var(--color-border)', borderRadius: '10px' }}><ChevronLeft /></IconButton>
                    <Typography variant="body2" sx={{ fontWeight: 700, minWidth: 64, textAlign: 'center' }}>{currentPage + 1} / {pageCount}</Typography>
                    <IconButton size="small" aria-label="Next page" disabled={currentPage >= pageCount - 1} onClick={() => setPage(currentPage + 1)} sx={{ border: '1px solid var(--color-border)', borderRadius: '10px' }}><ChevronRight /></IconButton>
                  </Stack>
                </Stack>
              )}
            </Box>
          )}
        </Box>
      </Card>

      {/* Edit / Create Form Dialog */}
      <Dialog open={Boolean(dialog && dialog.mode !== 'delete')} onClose={closeDialog} fullWidth maxWidth="sm">
        <DialogTitle component="div" sx={{ pt: 3.5, pb: 2.5, px: { xs: 3, sm: 4 }, display: 'flex', alignItems: 'center', gap: 2, borderBottom: '1px solid var(--color-border)' }}>
          <Box sx={{ perspective: 400 }}>
            <IconOrb size={46}>{dialog?.mode === 'edit' ? <Edit /> : <Add />}</IconOrb>
          </Box>
          <Box>
            <Typography variant="h2">
              {dialog?.mode === 'edit' ? `Edit ${singularTitle}` : `Add ${singularTitle}`}
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.25 }}>
              Manage configuration and settings.
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ py: 3, px: { xs: 3, sm: 4 }, display: 'flex', flexDirection: 'column', gap: 3 }}>
          {formError && <Alert severity="error" sx={{ mt: 2 }}>{formError}</Alert>}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5, mt: 2.5 }}>
            {fields.filter((field) => (dialog?.mode !== 'edit' || !omitOnEdit.includes(field.name))
              && (dialog?.mode !== 'create' || !omitOnCreate.includes(field.name))).map((field) => (
              <Box key={field.name} sx={{ gridColumn: field.multiline || field.fullWidth ? '1 / -1' : 'auto' }}>
                <Typography component="label" sx={{ display: 'block', mb: 0.75, fontWeight: 650, fontSize: '0.8125rem', color: 'var(--color-text-main)' }}>
                  {field.label} {field.required && <span style={{ color: 'var(--color-error)' }}>*</span>}
                </Typography>
                {field.type === 'select' ? (
                  <TextField
                    fullWidth select
                    required={field.required}
                    value={form[field.name] ?? ''}
                    onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
                    sx={{ '& .MuiOutlinedInput-root': { minHeight: 46 } }}
                  >
                    <MenuItem value="" disabled>Select an option</MenuItem>
                    {field.options?.map((opt) => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
                  </TextField>
                ) : (
                  <TextField
                    fullWidth type={field.type || 'text'}
                    multiline={field.multiline} minRows={field.multiline ? 3 : 1}
                    required={field.required} value={form[field.name] ?? ''}
                    onChange={(e) => setForm({ ...form, [field.name]: field.type === 'number' ? (e.target.value === '' ? '' : Number(e.target.value)) : e.target.value })}
                    slotProps={field.type === 'date' ? { inputLabel: { shrink: true } } : undefined}
                    sx={{ '& .MuiOutlinedInput-root': { minHeight: field.multiline ? 'auto' : 46 } }}
                  />
                )}
              </Box>
            ))}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: { xs: 3, sm: 4 }, pb: 3.5, pt: 2, gap: 1, borderTop: '1px solid var(--color-border)', bgcolor: 'rgba(246,248,250,0.6)' }}>
          <Button onClick={closeDialog} disabled={saving} variant="outlined">Cancel</Button>
          <Button variant="contained" onClick={save} disabled={saving}>
            {saving ? <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} /> : null}
            {saving ? 'Saving...' : `Save ${singularTitle}`}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={Boolean(dialog?.mode === 'delete')} onClose={closeDialog} maxWidth="xs" fullWidth>
        <DialogTitle component="div" sx={{ pt: 4, pb: 1, px: 3.5, textAlign: 'center' }}>
          <Box sx={{ perspective: 400, display: 'flex', justifyContent: 'center', mb: 2 }}>
            <IconOrb size={60} tone="#DC2626"><Delete /></IconOrb>
          </Box>
          <Typography variant="h2" sx={{ color: 'var(--color-text-main)' }}>Delete {singularTitle}</Typography>
        </DialogTitle>
        <DialogContent sx={{ px: 3.5, pb: 1, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">{deleteMessage}</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3.5, gap: 1, '& > *': { flex: 1 } }}>
          <Button onClick={closeDialog} disabled={deleting} variant="outlined">Cancel</Button>
          <Button variant="contained" onClick={remove} disabled={deleting} sx={{ background: 'linear-gradient(180deg, #EF4444, #DC2626 55%, #B91C1C)', borderColor: '#991B1B', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.22), 0 1px 0 #991B1B, 0 6px 14px -4px rgba(220,38,38,0.5)', '&:hover': { background: 'linear-gradient(180deg, #DC2626, #B91C1C)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.22), 0 3px 0 #991B1B, 0 14px 24px -8px rgba(220,38,38,0.55)' } }}>
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ResourcePage;
