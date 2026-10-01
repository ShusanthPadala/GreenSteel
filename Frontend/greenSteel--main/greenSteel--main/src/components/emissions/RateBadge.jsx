import { Box, Tooltip } from '@mui/material';
import ArrowUpwardRounded from '@mui/icons-material/ArrowUpwardRounded';
import ArrowDownwardRounded from '@mui/icons-material/ArrowDownwardRounded';
import RemoveRounded from '@mui/icons-material/RemoveRounded';

/**
 * Shows how fast an emission is changing. For pollutants, going UP is bad (red)
 * and going DOWN is good (green).
 */
export default function RateBadge({ trend, unit = '' }) {
    if (!trend || trend.changePct == null) {
        return <Box component="span" sx={{ fontSize: 11.5, color: '#94A3B8', fontWeight: 600 }}>—</Box>;
    }
    const pct = trend.changePct;
    const flat = Math.abs(pct) < 0.5;
    const up = pct > 0;
    const color = flat ? '#64748B' : up ? '#DC2626' : '#059669';
    const Icon = flat ? RemoveRounded : up ? ArrowUpwardRounded : ArrowDownwardRounded;
    const perDay = trend.perDay != null ? `${trend.perDay > 0 ? '+' : ''}${trend.perDay.toFixed(1)} ${unit}/day` : '';
    const tip = `${up ? '+' : ''}${pct.toFixed(1)}% since previous reading${perDay ? ` (${perDay})` : ''}${trend.change7Pct != null ? ` · 7-day avg ${trend.change7Pct > 0 ? '+' : ''}${trend.change7Pct.toFixed(1)}% vs prior week` : ''}`;
    return (
        <Tooltip title={tip}>
            <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.25, fontSize: 11.5, fontWeight: 800, color, whiteSpace: 'nowrap' }}>
                <Icon sx={{ fontSize: 14 }} />
                {Math.abs(pct).toFixed(1)}%
            </Box>
        </Tooltip>
    );
}
