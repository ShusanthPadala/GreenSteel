import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert, Box, Button, Card, Dialog, DialogActions, DialogContent,
  DialogTitle, IconButton, Stack, Table, TableBody, TableCell, TableHead,
  TableRow, TextField, Tooltip, Typography, CircularProgress, Chip, MenuItem,
} from '@mui/material';
import { Add, Delete, Edit, Refresh, Search, ListAlt } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { hasPermission } from '../../utils/permissions';
import { getErrorMessage } from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const defaultNormalize = (value) => value || [];

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
}) => {
  const { user } = useAuth();
  const canWrite = Boolean(user && (!writeRoles || (hasPermission(user, 'canCreate')
    && writeRoles.includes(user.role))));
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
  }, [load]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return rows.filter((row) => (!needle || searchKeys.some((key) => String(row[key] ?? '').toLowerCase().includes(needle)))
      && (!filter || String(row[filterKey]) === String(filter)));
  }, [filter, filterKey, query, rows, searchKeys]);
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
    try {
      setSaving(true);
      const payload = toPayload(form, fields, dialog.mode);
      if (dialog.mode === 'edit') await update(dialog.row.id, payload);
      else await create(payload);
      closeDialog();
      setNotice(`${singularTitle} saved successfully.`);
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
      await load();
    } catch (removeError) {
      setError(getErrorMessage(removeError, 'Unable to delete this record.'));
      closeDialog();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', pb: 4 }}>
      {/* Header Area */}
      <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'stretch', sm: 'flex-start' }} gap={2} sx={{ mb: 3.5, width: '100%', justifyContent: 'space-between', borderBottom: '1px solid #DDE4DE', pb: 2.25 }}>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h1" sx={{ mb: 0.5 }}>{title}</Typography>
          <Typography variant="body1" color="text.secondary">{subtitle}</Typography>
        </Box>
        {canWrite && (
          <Button
            variant="contained" 
            onClick={openCreate} 
            sx={{ 
              height: 42,
              minWidth: { xs: '100%', sm: 132 },
              px: 1.75,
              borderRadius: 1.5,
              bgcolor: '#3F654B',
              color: '#FFFFFF',
              alignSelf: { xs: 'stretch', sm: 'flex-start' },
              display: 'flex', alignItems: 'center', gap: 0.5
            }}
          >
            <Add fontSize="small" />
            <Typography component="span" sx={{ color: '#FFFFFF', fontWeight: 600, fontSize: '0.875rem' }}>Add {singularTitle}</Typography>
          </Button>
        )}
      </Stack>
      
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
      
      {/* Data Section */}
      <Card sx={{ width: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        {/* Toolbar */}
        <Box sx={{ px: { xs: 2, sm: 2.5 }, py: 1.5, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 1.25, alignItems: 'center', borderBottom: '1px solid #DDE4DE', bgcolor: '#FBFCFB' }}>
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
            <TextField 
              placeholder={searchPlaceholder} 
              value={query} 
              onChange={(e) => setQuery(e.target.value)} 
              sx={{ flexGrow: 1, width: '100%', '& .MuiOutlinedInput-root': { minHeight: 40 } }}
              InputProps={{ startAdornment: <Search sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} /> }}
            />
            {filterOptions && (
              <TextField 
                select 
                value={filter} 
                onChange={(e) => setFilter(e.target.value)} 
                sx={{ width: { xs: '100%', sm: 190 }, '& .MuiOutlinedInput-root': { minHeight: 40 } }}
              >
                <MenuItem value="">All {title}</MenuItem>
                {filterOptions.map((opt) => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
              </TextField>
            )}
          </Box>
          <Tooltip title={`Refresh ${title}`}>
            <IconButton onClick={load} disabled={loading} sx={{ width: 40, height: 40, border: '1px solid #C9D8CC', borderRadius: 1.5, color: '#3F654B', transition: 'all 180ms ease', '&:hover': { bgcolor: '#EAF1EB', transform: 'translateY(-1px)' } }}>
              <Refresh fontSize="small" sx={{ color: 'var(--color-text-main)' }} />
            </IconButton>
          </Tooltip>
        </Box>
        
        {/* Table Content */}
        <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column', width: '100%' }}>
          {loading ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(255,255,255,0.7)', py: 8 }}>
              <CircularProgress size={32} sx={{ mb: 1, color: 'primary.main' }} />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>Loading...</Typography>
            </Box>
          ) : filtered.length === 0 ? (
            <Box sx={{ py: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <ListAlt sx={{ fontSize: 40, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
              <Typography variant="h3" sx={{ mb: 0.5 }}>No {title.toLowerCase()} found</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>We couldn't find anything matching your criteria.</Typography>
              {canWrite && <Button variant="outlined" onClick={openCreate}>Create first {singularTitle.toLowerCase()}</Button>}
            </Box>
          ) : (
            <Box sx={{ overflowX: 'auto', flexGrow: 1, width: '100%' }}>
              <Table sx={{ minWidth: 800, width: '100%' }}>
                <TableHead>
                  <TableRow>
                    {columns.map((col) => <TableCell key={col.key}>{col.label}</TableCell>)}
                    {canWrite && <TableCell align="right">Actions</TableCell>}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.map((row, index) => (
                    <TableRow hover key={row.id}>
                      {columns.map((col) => {
                        const val = col.render ? col.render(row) : (row[col.key] ?? '-');
                        const isNum = typeof row[col.key] === 'number' || ['cox', 'nox', 'sox', 'pm', 'flyAsh', 'temperature', 'efficiency', 'healthScore'].includes(col.key);
                        const isStatus = col.key === 'status' || col.label.toLowerCase() === 'status';
                        const isLast = index === filtered.length - 1;
                        
                        return (
                          <TableCell key={col.key} align={isNum ? 'right' : 'left'} sx={{ fontWeight: isNum ? 600 : 400, fontFamily: isNum ? 'monospace' : 'inherit', fontSize: isNum ? 14 : 15, borderBottom: isLast ? 'none' : '1px solid var(--color-border)' }}>
                            {isStatus ? (
                              <Chip size="small" label={String(val)} sx={{ 
                                height: 24, fontSize: 11, fontWeight: 600, 
                                bgcolor: val === 'ACTIVE' || val === 'Active' || val === 'Operational' ? 'rgba(53, 94, 69, 0.1)' : 'var(--color-background)', 
                                color: val === 'ACTIVE' || val === 'Active' || val === 'Operational' ? 'var(--color-primary-green)' : 'var(--color-text-secondary)',
                                border: 'none'
                              }} />
                            ) : val}
                          </TableCell>
                        );
                      })}
                      {canWrite && (
                        <TableCell align="right" sx={{ borderBottom: index === filtered.length - 1 ? 'none' : '1px solid var(--color-border)' }}>
                          <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                            <Tooltip title="Edit">
                              <IconButton onClick={() => openEdit(row)} size="small" sx={{ borderRadius: 1.5, '&:hover': { bgcolor: 'var(--color-background)' } }}><Edit fontSize="small" sx={{ color: 'var(--color-text-secondary)' }} /></IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton onClick={() => setDialog({ mode: 'delete', row })} size="small" sx={{ borderRadius: 1.5, '&:hover': { bgcolor: '#fbf0f0' } }}><Delete fontSize="small" sx={{ color: 'var(--color-error)' }} /></IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}
        </Box>
      </Card>
      
      {/* Edit / Create Form Dialog */}
      <Dialog open={Boolean(dialog && dialog.mode !== 'delete')} onClose={closeDialog} fullWidth maxWidth="sm">
        <DialogTitle sx={{ pt: 4, pb: 2, px: 4, borderBottom: '1px solid var(--color-border)' }}>
           <Typography variant="h2">
             {dialog?.mode === 'edit' ? `Edit ${singularTitle}` : `Add ${singularTitle}`}
           </Typography>
           <Typography variant="body2" sx={{ mt: 0.5 }}>
             Manage configuration and settings.
           </Typography>
        </DialogTitle>
        <DialogContent sx={{ py: 3, px: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
          {formError && <Alert severity="error">{formError}</Alert>}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3, mt: 1 }}>
            {fields.map((field) => (
              <Box key={field.name} sx={{ gridColumn: field.multiline || field.fullWidth ? '1 / -1' : 'auto' }}>
                <Typography component="label" sx={{ display: 'block', mb: 1, fontWeight: 600, fontSize: '0.8125rem' }}>
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
                    InputLabelProps={field.type === 'date' ? { shrink: true } : undefined} 
                    sx={{ '& .MuiOutlinedInput-root': { minHeight: field.multiline ? 'auto' : 46 } }}
                  />
                )}
              </Box>
            ))}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 4, pt: 1 }}>
          <Button onClick={closeDialog} disabled={saving} variant="outlined">Cancel</Button>
          <Button variant="contained" onClick={save} disabled={saving}>
            {saving ? <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} /> : null}
            {saving ? 'Saving...' : `Save ${singularTitle}`}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={Boolean(dialog?.mode === 'delete')} onClose={closeDialog} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ pt: 4, pb: 1, px: 3 }}>
           <Typography variant="h2" sx={{ color: 'var(--color-error)' }}>Delete {singularTitle}</Typography>
        </DialogTitle>
        <DialogContent sx={{ px: 3, pb: 2 }}>
          <Typography variant="body1">{deleteMessage}</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={closeDialog} disabled={deleting} variant="outlined">Cancel</Button>
          <Button variant="contained" onClick={remove} disabled={deleting} sx={{ bgcolor: 'var(--color-error)', '&:hover': { bgcolor: '#C65353' } }}>
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ResourcePage;
