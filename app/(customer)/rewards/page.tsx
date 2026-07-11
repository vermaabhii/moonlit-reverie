'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import QRCode from 'qrcode';
import { motion, AnimatePresence } from 'framer-motion';
import { TopBar } from '@/components/TopBar';
import { Button } from '@/components/Button';
import { StampCard } from '@/components/StampCard';
import { getSession, SessionUser } from '@/lib/auth';
import { getMemberQrValue, getStampCard, StampCardState } from '@/lib/rewards';
import { X } from 'lucide-react';

export default function RewardsPage() {
  const [session, setSession] = useState<SessionUser | null | undefined>(undefined);
  const [card, setCard] = useState<StampCardState | null>(null);
  const [showCode, setShowCode] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      const s = await getSession();
      setSession(s);
      if (s) setCard(getStampCard(s.id));
    }
    init();
  }, []);

  useEffect(() => {
    if (!showCode || !session) return;
    let cancelled = false;

    async function render() {
      const value = getMemberQrValue(session!.id);
      const url = await QRCode.toDataURL(value, {
        margin: 1,
        width: 280,
        color: { dark: '#3D2314', light: '#F7F0E4' },
      });
      if (!cancelled) setQrDataUrl(url);
    }
    render();
    const interval = setInterval(render, 30000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [showCode, session]);

  if (session === undefined) return null;

  if (!session) {
    return (
      <main className="screen-scroll flex flex-col items-center px-6 py-16 text-center">
        <TopBar title="Rewards" />
        <p className="mt-10 text-sm text-coffee-muted">Sign in to see your punch card and member code.</p>
        <Link href="/login" className="mt-6 w-full">
          <Button className="w-full">Sign In</Button>
        </Link>
      </main>
    );
  }

  return (
    <main className="screen-scroll">
      <TopBar title="Rewards" />
      <div className="flex flex-col gap-5 px-5 py-5">
        <div className="text-center">
          <p className="font-mono text-xs uppercase tracking-wide text-coffee-muted">Member</p>
          <p className="font-display text-2xl tracking-wide text-coffee">{session.name}</p>
        </div>

        {card && <StampCard stamps={card.stamps} />}

        {card && card.rewardsEarned > 0 && (
          <p className="text-center font-mono text-xs text-coffee-muted">
            {card.rewardsEarned} free item{card.rewardsEarned > 1 ? 's' : ''} earned so far
          </p>
        )}

        <p className="text-center text-xs text-coffee-muted">
          Every order placed while signed in adds a stamp. Eight stamps unlocks a free item.
        </p>
        <Button size="lg" onClick={() => setShowCode(true)} className="w-full">
          Show My Code
        </Button>
        <Link href="/scan">
          <Button variant="secondary" className="w-full">
            Scan a Table to Order
          </Button>
        </Link>
      </div>

      <AnimatePresence>
        {showCode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-coffee/95 px-6"
          >
            <button
              onClick={() => setShowCode(false)}
              aria-label="Close"
              className="absolute right-5 flex h-10 w-10 items-center justify-center rounded-full border-2 border-cream text-cream"
              style={{ top: 'calc(var(--safe-top) + 16px)' }}
            >
              <X size={20} />
            </button>
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-xs rounded-card border-2 border-cream bg-cream p-6 text-center"
            >
              <p className="mb-4 font-display text-xl tracking-wide text-coffee">
                Show this to your cashier
              </p>
              {qrDataUrl ? (
                <img src={qrDataUrl} alt="Your member code" className="mx-auto rounded-card" />
              ) : (
                <div className="mx-auto h-[280px] w-[280px] animate-pulse rounded-card bg-coffee/10" />
              )}
              <p className="mt-4 font-mono text-[11px] text-coffee-muted">Refreshes automatically for security</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
