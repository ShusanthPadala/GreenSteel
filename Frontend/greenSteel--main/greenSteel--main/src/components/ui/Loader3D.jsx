import { Box, Typography } from '@mui/material';

/** Rotating 3D cube loader with an optional label. */
export default function Loader3D({ label = 'Loading...', sublabel, minHeight = '50vh', size = 44 }) {
  return (
    <Box
      role="status"
      aria-live="polite"
      sx={{ minHeight, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2.5, py: 4 }}
    >
      <Box className="gs-loader" sx={{ width: size, height: size }}>
        <div className="gs-loader-cube">
          <span /><span /><span /><span /><span /><span />
        </div>
      </Box>
      <Box sx={{ textAlign: 'center' }}>
        <Typography sx={{ fontWeight: 700, color: 'text.primary', fontSize: '0.95rem' }}>{label}</Typography>
        {sublabel && <Typography variant="body2" sx={{ mt: 0.25 }}>{sublabel}</Typography>}
      </Box>
    </Box>
  );
}
