'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { TopBar } from '@/components/TopBar';
import { Button } from '@/components/Button';
import { cn } from '@/lib/cn';
import { fillDemoCredentials, fillAdminDemoCredentials, getSession, signIn, signOut, signUp, SessionUser } from '@/lib/auth';
import { CalendarClock, QrCode, LogOut, Sparkles } from 'lucide-react';

type Mode = 'signin' | 'signup';

export default function LoginPage() {
  const [session, setSession] = useState<SessionUser | null>(null);
  const [mode, setMode] = useState<Mode>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSession(getSession());
    setReady(true);
  }, []);

  function handleDemoFill() {
    const demo = fillDemoCredentials();
    setEmail(demo.email);
    setPassword(demo.password);
    setMode('signin');
    setError(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const result = mode === 'signin' ? signIn(email, password) : signUp(name, email, password);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setSession(getSession());
  }

  function handleSignOut() {
    signOut();
    setSession(null);
    setEmail('');
    setPassword('');
    setName('');
  }

  if (!ready) return null;

  if (session) {
    return (
      <main className="screen-scroll">
        <TopBar title="Account" />
        <div className="px-5 py-6">
          <div className="vintage-border rounded-card bg-cream-dark p-5">
            <p className="font-mono text-xs uppercase tracking-wide text-coffee-muted">Signed in as</p>
            <p className="mt-1 font-display text-2xl tracking-wide text-coffee">{session.name}</p>
            <p className="text-sm text-coffee-muted">{session.email}</p>
          </div>

          <div className="mt-5 flex flex-col gap-3">
            <Link
              href="/my-reservations"
              className="vintage-border flex items-center justify-between rounded-card bg-cream-dark px-4 py-3.5"
            >
              <span className="flex items-center gap-2 font-display text-lg tracking-wide text-coffee">
                <CalendarClock size={19} className="text-rust" /> My Reservations
              </span>
              <span className="text-coffee-muted">→</span>
            </Link>
            <Link
              href="/rewards"
              className="vintage-border flex items-center justify-between rounded-card bg-cream-dark px-4 py-3.5"
            >
              <span className="flex items-center gap-2 font-display text-lg tracking-wide text-coffee">
                <QrCode size={19} className="text-rust" /> Rewards &amp; Punch Card
              </span>
              <span className="text-coffee-muted">→</span>
            </Link>
          </div>

          <Button variant="ghost" onClick={handleSignOut} className="mt-8 w-full">
            <LogOut size={16} /> Sign Out
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="screen-scroll">
      <TopBar title={mode === 'signin' ? 'Sign In' : 'Sign Up'} />
      <div className="px-5 py-6">
        <div className="mb-5 flex rounded-sign border-2 border-coffee p-1">
          <button
            onClick={() => setMode('signin')}
            className={cn(
              'flex-1 rounded-sign py-2 font-display text-sm tracking-wide',
              mode === 'signin' ? 'bg-coffee text-cream' : 'text-coffee'
            )}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode('signup')}
            className={cn(
              'flex-1 rounded-sign py-2 font-display text-sm tracking-wide',
              mode === 'signup' ? 'bg-coffee text-cream' : 'text-coffee'
            )}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {mode === 'signup' && (
            <label className="block">
              <span className="mb-1.5 block font-display text-sm tracking-wide text-coffee">Name</span>
              <input
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="vintage-border w-full rounded-sign bg-cream-dark px-3 py-2.5 text-sm"
              />
            </label>
          )}
          <label className="block">
            <span className="mb-1.5 block font-display text-sm tracking-wide text-coffee">Email</span>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="vintage-border w-full rounded-sign bg-cream-dark px-3 py-2.5 text-sm"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block font-display text-sm tracking-wide text-coffee">Password</span>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="vintage-border w-full rounded-sign bg-cream-dark px-3 py-2.5 text-sm"
            />
          </label>

          {error && <p className="rounded-sign bg-rust/10 px-3 py-2 text-sm text-rust-dark">{error}</p>}

          <Button type="submit" size="lg" className="w-full">
            {mode === 'signin' ? 'Sign In' : 'Create Account'}
          </Button>
        </form>

        <div className="mt-5 flex flex-col gap-2">
          <button
            onClick={handleDemoFill}
            className="flex w-full items-center justify-center gap-1.5 font-mono text-xs text-coffee-muted underline underline-offset-2"
          >
            <Sparkles size={14} /> Fill demo account
          </button>
          <button
            onClick={() => {
              const demo = fillAdminDemoCredentials();
              setEmail(demo.email);
              setPassword(demo.password);
              setMode('signin');
              setError(null);
            }}
            className="flex w-full items-center justify-center gap-1.5 font-mono text-xs text-coffee-muted underline underline-offset-2"
          >
            <Sparkles size={14} /> Fill admin demo
          </button>
        </div>
      </div>
    </main>
  );
}
