import { Box } from '@mui/material';
import { statusMeta } from '../../constants/statusMeta';

/** Small coloured pill for normal / warning / breach / maintenance / unknown. */
export default function StatusChip({ status, label, size = 'md' }) {
    const m = statusMeta(status);
    const small = size === 'sm';
    return (
        <Box component="span" sx={{
            display: 'inline-flex', alignItems: 'center', gap: 0.75, whiteSpace: 'nowrap',
            px: small ? 1 : 1.25, height: small ? 22 : 26, borderRadius: 999,
            fontSize: small ? 11 : 11.5, fontWeight: 700, color: m.color, bgcolor: m.bg, border: `1px solid ${m.border}`,
        }}>
            <Box component="span" sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: m.color, boxShadow: status === 'breach' ? `0 0 0 3px ${m.bg}` : 'none' }} />
            {label || m.label}
        </Box>
    );
}
