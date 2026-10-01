import { Box } from '@mui/material';

/** A raised, glossy 3D icon chip. `tone` is any hex colour from the palette. */
export default function IconOrb({ children, tone = '#047857', size = 44, sx }) {
  return (
    <Box
      aria-hidden
      sx={{
        width: size,
        height: size,
        flexShrink: 0,
        display: 'grid',
        placeItems: 'center',
        borderRadius: `${Math.round(size * 0.32)}px`,
        color: '#FFFFFF',
        background: `linear-gradient(145deg, ${tone}CC 0%, ${tone} 45%, ${tone} 100%)`,
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -3px 6px rgba(0,0,0,0.18), 0 6px 14px -4px ${tone}99, 0 2px 0 ${tone}55`,
        position: 'relative',
        transform: 'translateZ(24px)',
        '&::after': {
          content: '""',
          position: 'absolute',
          inset: '2px 2px 50% 2px',
          borderRadius: `${Math.round(size * 0.28)}px ${Math.round(size * 0.28)}px 40% 40%`,
          background: 'linear-gradient(180deg, rgba(255,255,255,0.28), rgba(255,255,255,0))',
          pointerEvents: 'none',
        },
        '& svg': { fontSize: Math.round(size * 0.48), position: 'relative', zIndex: 1, filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.2))' },
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}
