// GreenSteel design tokens — "Emerald & Slate": emerald brand, teal/cyan data accents, slate neutrals.
export const palette = {
  primary: '#047857',
  primaryDark: '#065F46',
  primaryDeep: '#064E3B',
  night: '#0F172A', // slate-900, darkest neutral
  primaryLight: '#ECFDF5',
  mint: '#34D399', // live / glow accent
  teal: '#0D9488',
  cyan: '#0891B2', // monitoring / sensor accent
  sage: '#6EE7B7',
  bg: '#F6F8FA',
  surface: '#FFFFFF',
  text: '#0F172A',
  textSecondary: '#475569',
  border: '#E2E8F0',
  borderStrong: '#CBD5E1',
  success: '#059669',
  warning: '#D97706',
  error: '#DC2626',
  social: '#0E7490',
  governance: '#B45309',
};

// Emerald → teal → cyan surfaces for hero panels (all keep white text at AA contrast)
export const hero = {
  from: '#047857',
  via: '#0F766E',
  to: '#0E7490',
  gradient: (angle = 150) => `linear-gradient(${angle}deg, #047857 0%, #0F766E 55%, #0E7490 100%)`,
  glow: 'radial-gradient(600px 420px at 75% 30%, rgba(52,211,153,0.28), transparent 60%)',
  shadow: '0 2px 4px rgba(6,78,59,0.06), 0 30px 60px -26px rgba(6,78,59,0.45), inset 0 1px 0 rgba(255,255,255,0.25)',
};

// Layered "3D" depth shadows
export const depth = {
  1: '0 1px 2px rgba(15,23,42,0.04), 0 2px 6px rgba(15,23,42,0.04)',
  2: '0 1px 2px rgba(15,23,42,0.04), 0 6px 16px rgba(15,23,42,0.07), 0 16px 32px -12px rgba(15,23,42,0.10)',
  3: '0 2px 4px rgba(15,23,42,0.04), 0 12px 24px rgba(15,23,42,0.10), 0 32px 56px -16px rgba(6,78,59,0.22)',
  inset: 'inset 0 1px 0 rgba(255,255,255,0.9), inset 0 -1px 0 rgba(15,23,42,0.04)',
};

export const glass = {
  background: 'rgba(255,255,255,0.72)',
  backdropFilter: 'blur(18px) saturate(160%)',
  WebkitBackdropFilter: 'blur(18px) saturate(160%)',
  border: '1px solid rgba(255,255,255,0.9)',
};

export const headingFont = '"Manrope", "Inter", system-ui, sans-serif';

// Hover lift for card-like tiles that aren't MUI <Card> (same feel as cards)
export const hoverLift = {
  transition: 'transform 240ms cubic-bezier(.2,.8,.2,1), box-shadow 240ms ease, border-color 240ms ease',
  '@media (hover: hover)': {
    '&:hover': {
      transform: 'translateY(-3px)',
      borderColor: 'rgba(4,120,87,0.35)',
      boxShadow: '0 14px 28px -14px rgba(15,23,42,0.28), 0 0 0 3px rgba(52,211,153,0.10)',
    },
  },
};
