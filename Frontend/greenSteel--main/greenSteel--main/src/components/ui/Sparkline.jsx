/** Tiny trend line. `values` = numbers in time order; `limit` draws a dashed limit line. */
export default function Sparkline({ values = [], color = '#047857', width = 96, height = 30, limit = null }) {
    const pts = values.filter((v) => typeof v === 'number' && Number.isFinite(v));
    if (pts.length < 2) return <svg width={width} height={height} aria-hidden />;
    const lo = Math.min(...pts, limit ?? Infinity) * 0.97;
    const hi = Math.max(...pts, limit ?? -Infinity) * 1.03;
    const x = (i) => (i / (pts.length - 1)) * (width - 4) + 2;
    const y = (v) => height - 3 - ((v - lo) / (hi - lo || 1)) * (height - 6);
    const d = pts.map((v, i) => `${i ? 'L' : 'M'} ${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ');
    const area = `${d} L ${x(pts.length - 1)} ${height} L ${x(0)} ${height} Z`;
    const id = `sg-${color.slice(1)}-${pts.length}`;
    return (
        <svg width={width} height={height} aria-hidden style={{ display: 'block' }}>
            <defs>
                <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.25" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            {limit != null && limit <= hi && limit >= lo && (
                <line x1="0" x2={width} y1={y(limit)} y2={y(limit)} stroke="#DC2626" strokeOpacity="0.5" strokeDasharray="3 3" strokeWidth="1" />
            )}
            <path d={area} fill={`url(#${id})`} />
            <path d={d} fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx={x(pts.length - 1)} cy={y(pts[pts.length - 1])} r="2.5" fill={color} />
        </svg>
    );
}
