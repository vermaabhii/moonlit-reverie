'use client';

import { motion } from 'framer-motion';
import { Coffee } from 'lucide-react';
import { STAMPS_PER_REWARD } from '@/lib/rewards';
import { cn } from '@/lib/cn';

interface StampCardProps {
  stamps: number;
}

export function StampCard({ stamps }: StampCardProps) {
  return (
    <div className="vintage-border rounded-card bg-cream-dark p-5 shadow-sign">
      <div className="mb-4 flex items-center justify-between">
        <p className="font-display text-xl tracking-wide text-coffee">Punch Card</p>
        <p className="font-mono text-xs text-coffee-muted">
          {stamps}/{STAMPS_PER_REWARD}
        </p>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {Array.from({ length: STAMPS_PER_REWARD }).map((_, i) => {
          const filled = i < stamps;
          return (
            <div key={i} className={cn('stamp-dot', filled && 'border-solid border-rust bg-rust/10')}>
              {filled ? (
                <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: -12 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                >
                  <Coffee size={20} className="text-rust" strokeWidth={2.5} />
                </motion.div>
              ) : (
                <span className="font-mono text-[10px] text-coffee-muted/50">{i + 1}</span>
              )}
            </div>
          );
        })}
      </div>
      <p className="mt-4 text-center text-sm text-coffee-muted">
        {STAMPS_PER_REWARD - stamps} more scan{STAMPS_PER_REWARD - stamps === 1 ? '' : 's'} for a free item
        on the house.
      </p>
    </div>
  );
}
