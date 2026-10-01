import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion, useMotionTemplate } from 'framer-motion';

/**
 * Wraps children in a pointer-tracked 3D tilt with a soft light glare.
 * Purely visual — falls back to a flat card when reduced motion is preferred
 * or on touch devices.
 */
export default function TiltCard({ children, intensity: rawIntensity = 3, glare = true, lift = 0, style, className, radius = 20 }) {
  // Capped so cards feel responsive without wobbling
  const intensity = Math.min(rawIntensity, 3);
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const hover = useMotionValue(0);

  const spring = { stiffness: 260, damping: 30, mass: 0.5 };
  const rotateX = useSpring(useTransform(y, [0, 1], [intensity, -intensity]), spring);
  const rotateY = useSpring(useTransform(x, [0, 1], [-intensity, intensity]), spring);
  const z = useSpring(useTransform(hover, [0, 1], [0, lift]), spring);
  const glareX = useTransform(x, (v) => `${v * 100}%`);
  const glareY = useTransform(y, (v) => `${v * 100}%`);
  const glareOpacity = useSpring(hover, spring);
  const glareBg = useMotionTemplate`radial-gradient(420px circle at ${glareX} ${glareY}, rgba(255,255,255,0.28), transparent 45%)`;

  const handleMove = (event) => {
    if (reduceMotion || event.pointerType === 'touch' || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((event.clientX - rect.left) / rect.width);
    y.set((event.clientY - rect.top) / rect.height);
  };

  const reset = () => {
    x.set(0.5);
    y.set(0.5);
    hover.set(0);
  };

  if (reduceMotion) {
    return <div className={className} style={{ height: '100%', ...style }}>{children}</div>;
  }

  return (
    <div style={{ perspective: 1000, height: '100%', ...style }} className={className}>
      <motion.div
        ref={ref}
        onPointerMove={handleMove}
        onPointerEnter={(e) => { if (e.pointerType !== 'touch') hover.set(1); }}
        onPointerLeave={reset}
        style={{ rotateX, rotateY, z, transformStyle: 'preserve-3d', height: '100%', position: 'relative', borderRadius: radius }}
      >
        {children}
        {glare && (
          <motion.div
            aria-hidden
            style={{
              position: 'absolute', inset: 0, borderRadius: radius, pointerEvents: 'none',
              background: glareBg, opacity: glareOpacity, mixBlendMode: 'soft-light', zIndex: 2,
            }}
          />
        )}
      </motion.div>
    </div>
  );
}
