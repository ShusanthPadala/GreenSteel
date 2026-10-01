import { lazy, Suspense } from 'react';

const SteelScene = lazy(() => import('./SteelScene'));

/** Loads the WebGL scene in its own chunk so it never slows first paint. */
export default function LazySteelScene(props) {
  return (
    <Suspense fallback={null}>
      <SteelScene {...props} />
    </Suspense>
  );
}
