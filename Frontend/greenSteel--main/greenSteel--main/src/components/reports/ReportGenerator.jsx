import { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Alert, Box, Button, Card, MenuItem, Stack, TextField, Typography } from '@mui/material';
import DownloadRounded from '@mui/icons-material/DownloadRounded';
import PictureAsPdfOutlined from '@mui/icons-material/PictureAsPdfOutlined';
import SummarizeOutlined from '@mui/icons-material/SummarizeOutlined';
import IconOrb from '../ui/IconOrb';
import usePlantData from '../../hooks/usePlantData';
import { useAuth } from '../../contexts/AuthContext';
import { canDo, isDepartmentScoped } from '../../utils/permissions';
import { reportService } from '../../services/reportService';
import { getErrorMessage } from '../../services/api';
import { POLLUTANTS } from '../../constants/plantModel';
import { classify, recordStatus } from '../../utils/emissionAnalytics';
import { palette as p } from '../../styles/tokens';

const fmt = (v, d = 1) => (typeof v === 'number' && Number.isFinite(v) ? v.toFixed(d) : '—');
const avg = (a) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : null);
const monthOf = (r) => String(r.recordedAt || '').slice(0, 7);
const csvCell = (v) => {
    const s = v == null ? '' : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

/**
 * Builds real reports from emission records:
 *  - CSV: every reading in the month with its limit status
 *  - PDF: printable summary (averages vs limits, breaches, department table)
 * When the user may create reports, a record is saved to the Reports list too.
 */
export default function ReportGenerator({ onSaved }) {
    const { user } = useAuth();
    const { units, records, limits, loading } = usePlantData();
    const scoped = isDepartmentScoped(user);
    const months = useMemo(() => [...new Set((records || []).map(monthOf).filter(Boolean))].sort().reverse(), [records]);
    const departments = useMemo(() => [...new Set((units || []).map((u) => u.departmentName).filter(Boolean))].sort(), [units]);
    const [month, setMonth] = useState('');
    const [dept, setDept] = useState('');
    const [msg, setMsg] = useState({ type: '', text: '' });
    const [printing, setPrinting] = useState(false);

    const activeMonth = month || months[0] || '';
    const activeDept = scoped ? user?.department : dept;
    const unitDept = useMemo(() => Object.fromEntries((units || []).map((u) => [String(u.id), u.departmentName])), [units]);

    const rows = useMemo(() => (records || [])
        .filter((r) => monthOf(r) === activeMonth)
        .filter((r) => !activeDept || unitDept[String(r.unitId)] === activeDept)
        .sort((a, b) => String(a.recordedAt).localeCompare(String(b.recordedAt))), [records, activeMonth, activeDept, unitDept]);

    const summary = useMemo(() => {
        const byDept = {};
        rows.forEach((r) => {
            const d = unitDept[String(r.unitId)] || 'Unassigned';
            (byDept[d] = byDept[d] || []).push(r);
        });
        const pollutant = Object.fromEntries(POLLUTANTS.map(({ key }) => {
            const vals = rows.map((r) => r[key]).filter((v) => typeof v === 'number');
            return [key, { avg: avg(vals), max: vals.length ? Math.max(...vals) : null, breaches: rows.filter((r) => classify(r[key], limits[key]?.limit) === 'breach').length }];
        }));
        const departmentsTable = Object.entries(byDept).map(([name, list]) => ({
            name,
            readings: list.length,
            efficiency: avg(list.map((r) => r.efficiency).filter((v) => typeof v === 'number')),
            health: avg(list.map((r) => r.healthScore).filter((v) => typeof v === 'number')),
            breaches: list.filter((r) => recordStatus(r, limits).status === 'breach').length,
        }));
        return {
            pollutant, departmentsTable,
            efficiency: avg(rows.map((r) => r.efficiency).filter((v) => typeof v === 'number')),
            health: avg(rows.map((r) => r.healthScore).filter((v) => typeof v === 'number')),
        };
    }, [rows, unitDept, limits]);

    const scopeLabel = activeDept || 'All departments';
    const title = `Emissions report — ${activeMonth || 'no data'} — ${scopeLabel}`;

    const saveRecord = async (format) => {
        if (!canDo(user, 'reports', 'create')) return;
        try {
            await reportService.createReport({ reportName: `Emissions ${activeMonth} (${scopeLabel})`, reportType: 'EMISSION', format, status: 'GENERATED' });
            onSaved?.();
        } catch (e) {
            setMsg({ type: 'warning', text: `Report downloaded, but it couldn't be saved to the list: ${getErrorMessage(e)}` });
        }
    };

    const downloadCsv = async () => {
        const header = ['Recorded at', 'Unit', 'Department', ...POLLUTANTS.map((pl) => `${pl.label} (${limits[pl.key]?.unit})`), 'Fly ash', 'Temperature', 'Efficiency', 'Health score', 'Limit status', 'Status'];
        const lines = rows.map((r) => [
            r.recordedAt, r.unitName, unitDept[String(r.unitId)] || '', ...POLLUTANTS.map((pl) => r[pl.key]),
            r.flyAsh, r.temperature, r.efficiency, r.healthScore, recordStatus(r, limits).status, r.status,
        ].map(csvCell).join(','));
        const limitLine = ['Limits', '', '', ...POLLUTANTS.map((pl) => limits[pl.key]?.limit)].map(csvCell).join(',');
        const blob = new Blob(['\uFEFF' + [title, '', header.join(','), ...lines, '', limitLine].join('\n')], { type: 'text/csv;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `greensteel-emissions-${activeMonth}${activeDept ? `-${activeDept.replace(/\s+/g, '-').toLowerCase()}` : ''}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        setMsg({ type: 'success', text: `Downloaded ${rows.length} readings.` });
        await saveRecord('CSV');
    };

    const printPdf = async () => {
        setPrinting(true);
        document.body.classList.add('gs-printing');
        const done = () => {
            document.body.classList.remove('gs-printing');
            setPrinting(false);
            window.removeEventListener('afterprint', done);
        };
        window.addEventListener('afterprint', done);
        setTimeout(() => { window.print(); setTimeout(done, 500); }, 150);
        await saveRecord('PDF');
    };

    return (
        <Card sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
            <Stack direction="row" sx={{ alignItems: 'center', gap: 1.75, mb: 2 }}>
                <IconOrb size={44}><SummarizeOutlined /></IconOrb>
                <Box>
                    <Typography variant="h3">Generate emissions report</Typography>
                    <Typography variant="body2">Monthly readings with limit checks, as a spreadsheet (CSV) or a printable PDF summary.</Typography>
                </Box>
            </Stack>
            {msg.text && <Alert severity={msg.type} onClose={() => setMsg({ type: '', text: '' })} sx={{ mb: 2 }}>{msg.text}</Alert>}
            <Stack direction={{ xs: 'column', md: 'row' }} sx={{ gap: 1.5, alignItems: { md: 'center' } }}>
                <TextField select label="Month" value={activeMonth} onChange={(e) => setMonth(e.target.value)} disabled={!months.length} sx={{ minWidth: 170 }}>
                    {months.length === 0 && <MenuItem value="">No data yet</MenuItem>}
                    {months.map((m) => <MenuItem key={m} value={m}>{new Date(`${m}-01T00:00:00`).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</MenuItem>)}
                </TextField>
                <TextField select label="Department" value={activeDept || ''} onChange={(e) => setDept(e.target.value)} disabled={scoped} sx={{ minWidth: 220 }} slotProps={{ select: { displayEmpty: true }, inputLabel: { shrink: true } }}>
                    <MenuItem value="">All departments</MenuItem>
                    {(scoped && activeDept ? [activeDept] : departments).map((d) => <MenuItem key={d} value={d}>{d}</MenuItem>)}
                </TextField>
                <Typography variant="body2" sx={{ flex: 1 }}>{loading ? 'Loading data…' : `${rows.length} readings in this period`}</Typography>
                <Button variant="outlined" startIcon={<DownloadRounded />} onClick={downloadCsv} disabled={!rows.length}>Download CSV</Button>
                <Button variant="contained" startIcon={<PictureAsPdfOutlined />} onClick={printPdf} disabled={!rows.length || printing}>Print / Save PDF</Button>
            </Stack>

            {/* Printable summary — only visible while printing */}
            {createPortal(
                <div className="gs-print-only" style={{ fontFamily: 'Inter, sans-serif', color: '#0F172A', padding: 24 }}>
                    <div style={{ borderBottom: '3px solid #047857', paddingBottom: 12, marginBottom: 16 }}>
                        <div style={{ fontSize: 12, fontWeight: 800, color: '#047857', letterSpacing: '0.1em' }}>GREENSTEEL · ENVIRONMENTAL MONITORING</div>
                        <h1 style={{ fontSize: 24, margin: '6px 0 2px' }}>{title}</h1>
                        <div style={{ fontSize: 12, color: '#475569' }}>Generated {new Date().toLocaleString()} by {user?.firstName} {user?.lastName} ({user?.role}) · {rows.length} readings</div>
                    </div>
                    <h2 style={{ fontSize: 16 }}>Plant performance</h2>
                    <p style={{ fontSize: 13 }}>Average efficiency (sustainability score): <b>{fmt(summary.efficiency)}%</b> · Average unit health: <b>{fmt(summary.health)}</b></p>
                    <h2 style={{ fontSize: 16 }}>Pollutants vs limits</h2>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, marginBottom: 16 }}>
                        <thead><tr>{['Pollutant', 'Limit', 'Average', 'Peak', 'Breaches'].map((h) => <th key={h} style={{ textAlign: 'left', borderBottom: '1px solid #CBD5E1', padding: 6 }}>{h}</th>)}</tr></thead>
                        <tbody>
                            {POLLUTANTS.map((pl) => {
                                const s = summary.pollutant[pl.key];
                                return (
                                    <tr key={pl.key}>
                                        <td style={{ padding: 6, borderBottom: '1px solid #E2E8F0' }}>{pl.label} — {pl.name}</td>
                                        <td style={{ padding: 6, borderBottom: '1px solid #E2E8F0' }}>{limits[pl.key]?.limit} {limits[pl.key]?.unit}</td>
                                        <td style={{ padding: 6, borderBottom: '1px solid #E2E8F0' }}>{fmt(s.avg)}</td>
                                        <td style={{ padding: 6, borderBottom: '1px solid #E2E8F0', color: s.max >= limits[pl.key]?.limit ? '#DC2626' : 'inherit' }}>{fmt(s.max)}</td>
                                        <td style={{ padding: 6, borderBottom: '1px solid #E2E8F0', color: s.breaches ? '#DC2626' : '#059669', fontWeight: 700 }}>{s.breaches}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    <h2 style={{ fontSize: 16 }}>By department</h2>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                        <thead><tr>{['Department', 'Readings', 'Avg efficiency', 'Avg health', 'Readings over limit'].map((h) => <th key={h} style={{ textAlign: 'left', borderBottom: '1px solid #CBD5E1', padding: 6 }}>{h}</th>)}</tr></thead>
                        <tbody>
                            {summary.departmentsTable.map((d) => (
                                <tr key={d.name}>
                                    <td style={{ padding: 6, borderBottom: '1px solid #E2E8F0' }}>{d.name}</td>
                                    <td style={{ padding: 6, borderBottom: '1px solid #E2E8F0' }}>{d.readings}</td>
                                    <td style={{ padding: 6, borderBottom: '1px solid #E2E8F0' }}>{fmt(d.efficiency)}%</td>
                                    <td style={{ padding: 6, borderBottom: '1px solid #E2E8F0' }}>{fmt(d.health)}</td>
                                    <td style={{ padding: 6, borderBottom: '1px solid #E2E8F0', color: d.breaches ? '#DC2626' : '#059669', fontWeight: 700 }}>{d.breaches}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <p style={{ fontSize: 10, color: '#64748B', marginTop: 24 }}>Limits: {POLLUTANTS.map((pl) => `${pl.label} ${limits[pl.key]?.limit} ${limits[pl.key]?.unit} (${limits[pl.key]?.source === 'database' ? 'plant setting' : 'default'})`).join(' · ')}</p>
                </div>,
                document.body,
            )}
            <Typography variant="caption" sx={{ display: 'block', mt: 1.5, color: p.textSecondary }}>
                Tip: in the print window choose “Save as PDF” as the destination.
            </Typography>
        </Card>
    );
}
