import { Box, Typography } from "@mui/material";
import { TrendingUp, TrendingDown } from "@mui/icons-material";
import { motion, useReducedMotion } from "framer-motion";
import TiltCard from "../ui/TiltCard";
import IconOrb from "../ui/IconOrb";
import { palette as p, depth, headingFont } from "../../styles/tokens";

const tones = {
    positive: { status: "#047857", orb: p.primary, chip: "rgba(5,150,105,0.10)" },
    negative: { status: p.error, orb: p.error, chip: "rgba(220,38,38,0.10)" },
    warning: { status: p.warning, orb: p.warning, chip: "rgba(217,119,6,0.12)" },
    neutral: { status: p.textSecondary, orb: "#0F766E", chip: "rgba(15,23,42,0.05)" },
};

const DashboardKPICard = ({ icon, title, value, unit, trend, trendType, index = 0 }) => {
    const reduceMotion = useReducedMotion();
    const tone = tones[trendType] || tones.neutral;

    return (
        <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.04, ease: 'easeOut' }}
            style={{ height: '100%' }}
        >
            <TiltCard intensity={9}>
                <Box sx={{
                    position: 'relative',
                    height: '100%',
                    p: 3,
                    borderRadius: '20px',
                    overflow: 'hidden',
                    display: "flex",
                    flexDirection: "column",
                    minHeight: 168,
                    transformStyle: 'preserve-3d',
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.96), rgba(255,255,255,0.78))',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255,255,255,0.95)',
                    outline: `1px solid ${p.border}`,
                    outlineOffset: -1,
                    boxShadow: `${depth.inset}, ${depth[2]}`,
                    transition: 'box-shadow 220ms ease',
                    '@media (hover: hover)': { '&:hover': { boxShadow: `${depth.inset}, ${depth[3]}, 0 0 0 4px rgba(52,211,153,0.12)`, outlineColor: 'rgba(4,120,87,0.3)' } },
                }}>
                    {/* soft tone glow */}
                    <Box aria-hidden sx={{ position: 'absolute', width: 160, height: 160, borderRadius: '50%', top: -70, right: -60, background: `radial-gradient(circle, ${tone.orb}22, transparent 70%)`, pointerEvents: 'none' }} />

                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2.5, position: 'relative' }}>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: "text.secondary", textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.7rem', pt: 0.5 }}>
                            {title}
                        </Typography>
                        <IconOrb tone={tone.orb} size={42}>{icon}</IconOrb>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.75, mb: 2, flexGrow: 1, transform: 'translateZ(20px)' }}>
                        <Typography sx={{ fontFamily: headingFont, fontSize: "2.35rem", fontWeight: 800, lineHeight: 1, color: p.text, letterSpacing: "-0.04em" }}>
                            {value}
                        </Typography>
                        {unit && (
                            <Typography variant="body2" sx={{ fontWeight: 650, color: "text.secondary" }}>
                                {unit}
                            </Typography>
                        )}
                    </Box>

                    {trend && (
                        <Box sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 0.5,
                            color: tone.status,
                            mt: "auto",
                            bgcolor: tone.chip,
                            alignSelf: 'flex-start',
                            px: 1.25, py: 0.5,
                            borderRadius: 999,
                            border: `1px solid ${tone.status}22`,
                        }}>
                            {trendType === 'positive' && <TrendingDown sx={{ fontSize: 14 }} />}
                            {trendType === 'negative' && <TrendingUp sx={{ fontSize: 14 }} />}
                            <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.74rem' }}>
                                {trend}
                            </Typography>
                        </Box>
                    )}
                </Box>
            </TiltCard>
        </motion.div>
    );
};

export default DashboardKPICard;
