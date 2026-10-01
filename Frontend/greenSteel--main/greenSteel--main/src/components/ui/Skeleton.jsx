import { Box } from '@mui/material';

/** Shimmering placeholder shown while data loads. */
export default function Skeleton({ height = 20, width = '100%', radius = 12, sx }) {
    return <Box className="gs-skeleton" aria-hidden sx={{ height, width, borderRadius: `${radius}px`, ...sx }} />;
}

/** A grid of card-shaped skeletons. */
export function SkeletonCards({ count = 4, height = 150, columns = { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(4, 1fr)' } }) {
    return (
        <Box role="status" aria-label="Loading" sx={{ display: 'grid', gridTemplateColumns: columns, gap: 2.5 }}>
            {Array.from({ length: count }).map((_, i) => <Skeleton key={i} height={height} radius={20} />)}
        </Box>
    );
}
