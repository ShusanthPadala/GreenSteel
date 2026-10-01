import { useLayoutEffect, useRef, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { motion, useReducedMotion } from 'framer-motion';
import { GAS_FLOWS } from '../../constants/plantModel';
import { statusMeta } from '../../constants/statusMeta';

const NODE_W = 184;
const NODE_H = 78;
const KIND_COLOR = { gas: '#0D9488', material: '#64748B', utility: '#0891B2' };
// Extra curvature for flows that would otherwise cut straight through another department
const BEND = { 'coke>power': 0.3, 'utilities>bf': 0.12, 'bf>power': 0.08, 'coke>bf': 0.06 };

// Point where the segment from the rectangle's centre toward (tx, ty) leaves the rectangle
const exitPoint = (cx, cy, tx, ty, pad = 6) => {
    const dx = tx - cx;
    const dy = ty - cy;
    const hw = NODE_W / 2 + pad;
    const hh = NODE_H / 2 + pad;
    const s = Math.min(dx ? hw / Math.abs(dx) : Infinity, dy ? hh / Math.abs(dy) : Infinity);
    return [cx + dx * s, cy + dy * s];
};

/**
 * Interactive plant map. `nodes` come from analysePlant().nodes.
 * Flows from a department in warning/breach glow amber/red to show the risk
 * travelling downstream with the gas.
 */
export default function PlantFlowMap({ nodes, selectedId, onSelect, highlightId }) {
    const reduceMotion = useReducedMotion();
    const ref = useRef(null);
    const [size, setSize] = useState({ w: 900, h: 470 });

    useLayoutEffect(() => {
        const el = ref.current;
        if (!el) return undefined;
        const update = () => setSize({ w: el.clientWidth, h: el.clientHeight });
        update();
        const ro = new ResizeObserver(update);
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
    const pos = (n) => [(n.x / 100) * size.w, (n.y / 100) * size.h];
    const focus = selectedId || highlightId;

    const flows = GAS_FLOWS.map((f) => {
        const a = byId[f.from];
        const b = byId[f.to];
        const [ax, ay] = pos(a);
        const [bx, by] = pos(b);
        const len = Math.hypot(bx - ax, by - ay) || 1;
        const bend = BEND[`${f.from}>${f.to}`] ?? 0;
        // control point offset perpendicular to the line
        const mx = (ax + bx) / 2 + (-(by - ay) / len) * bend * len;
        const my = (ay + by) / 2 + ((bx - ax) / len) * bend * len;
        const [sx, sy] = exitPoint(ax, ay, mx, my);
        const [ex, ey] = exitPoint(bx, by, mx, my, 10);
        const sourceStatus = a.status;
        const risky = sourceStatus === 'breach' || sourceStatus === 'warning';
        const color = risky ? statusMeta(sourceStatus).color : KIND_COLOR[f.kind];
        const related = focus && (f.from === focus || f.to === focus);
        const dim = focus && !related;
        // label at curve midpoint (t = 0.5 on the quadratic)
        const lx = 0.25 * sx + 0.5 * mx + 0.25 * ex;
        const ly = 0.25 * sy + 0.5 * my + 0.25 * ey;
        return { ...f, d: `M ${sx} ${sy} Q ${mx} ${my} ${ex} ${ey}`, color, risky, related, dim, lx, ly };
    });

    return (
        <Box sx={{ overflowX: 'auto', mx: { xs: -1, sm: 0 } }}>
            <Box
                ref={ref}
                role="group"
                aria-label="Plant gas flow map"
                sx={{
                    position: 'relative', minWidth: 780, height: { xs: 440, md: 480 }, borderRadius: '18px', overflow: 'hidden',
                    background: 'radial-gradient(800px 380px at 50% 50%, rgba(236,253,245,0.9), rgba(246,248,250,0.6) 70%)',
                    border: '1px solid #E2E8F0',
                    backgroundImage: 'linear-gradient(rgba(4,120,87,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(4,120,87,0.05) 1px, transparent 1px)',
                    backgroundSize: '28px 28px',
                }}
            >
                <svg width={size.w} height={size.h} style={{ position: 'absolute', inset: 0 }} aria-hidden>
                    <defs>
                        {['#0D9488', '#64748B', '#0891B2', '#D97706', '#DC2626'].map((c) => (
                            <marker key={c} id={`arrow-${c.slice(1)}`} viewBox="0 0 10 10" refX="7" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                                <path d="M 0 0 L 10 5 L 0 10 z" fill={c} />
                            </marker>
                        ))}
                    </defs>
                    {flows.map((f) => (
                        <g key={`${f.from}-${f.to}`} opacity={f.dim ? 0.22 : 1} style={{ transition: 'opacity 200ms ease' }}>
                            {/* soft glow under risky / focused flows */}
                            {(f.risky || f.related) && <path d={f.d} fill="none" stroke={f.color} strokeOpacity="0.18" strokeWidth={f.risky ? 12 : 9} strokeLinecap="round" />}
                            <path d={f.d} fill="none" stroke={f.color} strokeOpacity="0.35" strokeWidth={f.risky ? 3 : 2.25} strokeLinecap="round" />
                            <path
                                d={f.d}
                                fill="none"
                                stroke={f.color}
                                strokeWidth={f.risky ? 3 : 2.25}
                                strokeLinecap="round"
                                strokeDasharray={f.kind === 'material' ? '2 9' : '8 10'}
                                markerEnd={`url(#arrow-${f.color.slice(1)})`}
                                className={reduceMotion ? undefined : 'gs-flow-dash'}
                                style={{ animationDuration: f.risky ? '1.1s' : '2.2s' }}
                            />
                        </g>
                    ))}
                </svg>

                {/* flow labels */}
                {flows.map((f) => (
                    <Box key={`l-${f.from}-${f.to}`} sx={{
                        position: 'absolute', left: f.lx, top: f.ly, transform: 'translate(-50%, -50%)', pointerEvents: 'none',
                        px: 0.9, py: 0.2, borderRadius: 999, bgcolor: 'rgba(255,255,255,0.95)', border: `1px solid ${f.risky ? f.color : '#E2E8F0'}`,
                        fontSize: 10.5, fontWeight: 700, color: f.risky ? f.color : '#475569', whiteSpace: 'nowrap',
                        opacity: f.dim ? 0.3 : 1, transition: 'opacity 200ms ease', boxShadow: '0 2px 6px rgba(15,23,42,0.06)',
                    }}>
                        {f.label}
                    </Box>
                ))}

                {/* department nodes */}
                {nodes.map((n, i) => {
                    const [x, y] = pos(n);
                    const m = statusMeta(n.status);
                    const selected = n.id === selectedId;
                    const isMine = n.id === highlightId;
                    return (
                        <Box
                            key={n.id}
                            component={motion.button}
                            type="button"
                            onClick={() => onSelect?.(n.id)}
                            aria-pressed={selected}
                            aria-label={`${n.label}: ${m.label}${n.upstreamRisk.length ? ', upstream risk' : ''}`}
                            initial={reduceMotion ? false : { opacity: 0, scale: 0.85, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.05 * i }}
                            sx={{
                                position: 'absolute', left: x - NODE_W / 2, top: y - NODE_H / 2, width: NODE_W, height: NODE_H,
                                display: 'flex', alignItems: 'center', gap: 1.25, px: 1.25, textAlign: 'left', cursor: 'pointer',
                                font: 'inherit', borderRadius: '16px', bgcolor: '#FFFFFF',
                                border: `1.5px solid ${selected ? '#047857' : m.border}`,
                                boxShadow: selected
                                    ? '0 0 0 4px rgba(4,120,87,0.18), 0 18px 34px -14px rgba(15,23,42,0.35)'
                                    : '0 10px 24px -14px rgba(15,23,42,0.35), inset 0 1px 0 #fff',
                                transition: 'transform 220ms cubic-bezier(.2,.8,.2,1), box-shadow 220ms ease, border-color 220ms ease',
                                '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 0 0 4px rgba(52,211,153,0.14), 0 20px 36px -14px rgba(15,23,42,0.38)' },
                                '&:focus-visible': { outline: '2px solid #047857', outlineOffset: 3 },
                            }}
                        >
                            <Box sx={{
                                width: 42, height: 42, borderRadius: '12px', flexShrink: 0, display: 'grid', placeItems: 'center',
                                color: '#fff', fontSize: 12, fontWeight: 800, letterSpacing: '0.02em',
                                background: `linear-gradient(145deg, ${m.color}CC, ${m.color})`,
                                boxShadow: `inset 0 1px 0 rgba(255,255,255,0.35), 0 6px 12px -4px ${m.color}99`,
                                position: 'relative',
                            }}>
                                {n.short}
                                {n.status === 'breach' && !reduceMotion && (
                                    <Box component="span" sx={{ position: 'absolute', inset: -4, borderRadius: '14px', border: `2px solid ${m.color}`, animation: 'gs-ping 1.6s ease-out infinite' }} />
                                )}
                            </Box>
                            <Box sx={{ minWidth: 0 }}>
                                <Typography noWrap sx={{ fontSize: 13, fontWeight: 800, color: '#0F172A', lineHeight: 1.25 }}>{n.label}</Typography>
                                <Typography noWrap sx={{ fontSize: 11, fontWeight: 700, color: m.color }}>{m.label}</Typography>
                                {n.upstreamRisk.length > 0 && (
                                    <Typography noWrap sx={{ fontSize: 10.5, fontWeight: 700, color: '#B45309' }}>⚠ Upstream risk</Typography>
                                )}
                                {isMine && !n.upstreamRisk.length && (
                                    <Typography noWrap sx={{ fontSize: 10.5, fontWeight: 700, color: '#047857' }}>Your department</Typography>
                                )}
                            </Box>
                        </Box>
                    );
                })}
            </Box>
        </Box>
    );
}
