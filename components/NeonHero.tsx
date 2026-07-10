'use client';

import { motion } from 'framer-motion';

export function NeonHero() {
  return (
    <div className="relative flex h-72 flex-col items-center justify-center overflow-hidden bg-coffee">
      <div className="checker-strip absolute inset-x-0 bottom-0 h-3 opacity-80" />

      {/* rising steam */}
      <div className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center gap-6">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="block h-24 w-3 rounded-full bg-cream/10 blur-md"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: -70, opacity: [0, 0.5, 0] }}
            transition={{
              duration: 3.2,
              repeat: Infinity,
              delay: i * 0.7,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <motion.h1
        className="neon-text relative font-display text-6xl tracking-wide"
        initial={{ opacity: 0.3 }}
        animate={{ opacity: [0.3, 1, 0.6, 1, 1] }}
        transition={{ duration: 1.6, times: [0, 0.2, 0.35, 0.5, 1], ease: 'easeInOut' }}
      >
        Moonlit Reverie
      </motion.h1>
      <p className="relative mt-2 font-mono text-xs uppercase tracking-[0.3em] text-cream/70">
        Diner &amp; Coffee House
      </p>
    </div>
  );
}
