import { Box, Stack, Typography } from '@mui/material';
import { motion, useReducedMotion } from 'framer-motion';
import IconOrb from './IconOrb';

/** Consistent page header: eyebrow, title, subtitle, a 3D icon and actions. */
export default function PageHero({ eyebrow, title, subtitle, icon, actions, tone = '#047857' }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
       
       
        sx={{ gap: 2.5, alignItems: { xs: 'stretch', sm: 'center' }, mb: { xs: 3, sm: 4 }, width: '100%', justifyContent: 'space-between' }}
      >
        <Stack direction="row" sx={{ gap: 2, alignItems: "center", minWidth: 0 }}>
          {icon && (
            <Box sx={{ perspective: 400, display: { xs: 'none', sm: 'block' } }}>
              <IconOrb tone={tone} size={52}>{icon}</IconOrb>
            </Box>
          )}
          <Box sx={{ minWidth: 0 }}>
            {eyebrow && (
              <Typography sx={{ color: tone, fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', mb: 0.5 }}>
                {eyebrow}
              </Typography>
            )}
            <Typography variant="h1" sx={{ mb: 0.5 }}>{title}</Typography>
            {subtitle && <Typography variant="body1" color="text.secondary">{subtitle}</Typography>}
          </Box>
        </Stack>
        {actions && <Stack direction="row" sx={{ gap: 1.25, flexShrink: 0, '& > *': { flex: { xs: 1, sm: 'initial' } } }}>{actions}</Stack>}
      </Stack>
    </motion.div>
  );
}
