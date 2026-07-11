'use client';

import { useMemo, useState, useEffect } from 'react';
import { TopBar } from '@/components/TopBar';
import { Button } from '@/components/Button';
import { cn } from '@/lib/cn';
import { getSession } from '@/lib/auth';
import { createReservation } from '@/lib/reservations';
import type { Reservation } from '@/lib/mock-data';
import { useTableSession } from '@/lib/table-session';
import { CheckCircle2, Users, CalendarDays, Clock, StickyNote, MapPin } from 'lucide-react';

const TIME_SLOTS = ['11:30', '12:00', '12:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30'];

export default function ReservePage() {
  const [step, setStep] = useState(1);
  const [partySize, setPartySize] = useState(2);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState('19:00');
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [confirmed, setConfirmed] = useState<Reservation | null>(null);
  const [session, setSession] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function init() {
      setSession(await getSession());
    }
    init();
  }, []);

  // Table auto-detect: if a table was picked up from ?table=N (or set earlier this session),
  // treat it as already selected and let the guest change or clear it instead of asking again.
  const { table: detectedTable } = useTableSession();
  const [tableOverride, setTableOverride] = useState<number | null>(null);
  const [editingTable, setEditingTable] = useState(false);
  const [tableInput, setTableInput] = useState('');
  const effectiveTable = tableOverride ?? detectedTable;

  function saveTableInput() {
    const num = Number(tableInput);
    setTableOverride(Number.isInteger(num) && num > 0 ? num : null);
    setEditingTable(false);
  }

  const minDate = useMemo(() => new Date().toISOString().slice(0, 10), []);

  async function handleConfirm() {
    setError(null);
    setIsSubmitting(true);
    try {
      const userId = session?.id ?? `guest-${Date.now()}`;
      const reservation = await createReservation({
        userId: session?.id ?? userId,
        name: name.trim() || session?.name || 'Guest',
        partySize,
        date,
        time,
        notes: notes.trim() || undefined,
        table: effectiveTable ?? undefined,
      });
      setConfirmed(reservation);
    } catch {
      setError('We could not save your reservation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (confirmed) {
    return (
      <main className="screen-scroll flex flex-col items-center px-6 py-16 text-center">
        <CheckCircle2 size={56} className="text-rust" />
        <h1 className="mt-4 font-display text-3xl tracking-wide text-coffee">You&apos;re booked</h1>
        <p className="mt-2 text-sm text-coffee-muted">
          {confirmed.partySize} guest{confirmed.partySize > 1 ? 's' : ''} on{' '}
          {new Date(confirmed.date + 'T00:00:00').toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          })}{' '}
          at {confirmed.time}
        </p>
        {confirmed.table && (
          <p className="mt-1 flex items-center gap-1 font-mono text-xs text-coffee-muted">
            <MapPin size={13} /> Table {confirmed.table}
          </p>
        )}
        <div className="mt-6 vintage-border rounded-card bg-cream-dark px-6 py-4">
          <p className="font-mono text-xs uppercase tracking-wide text-coffee-muted">Confirmation Code</p>
          <p className="mt-1 font-mono text-2xl text-rust">{confirmed.confirmationCode}</p>
        </div>
        {!session && (
          <p className="mt-4 max-w-xs text-xs text-coffee-muted">
            Booked as a guest — sign in with a matching account to see this in My Reservations.
          </p>
        )}
        <a href="/my-reservations" className="mt-8 w-full">
          <Button className="w-full">View My Reservations</Button>
        </a>
      </main>
    );
  }

  return (
    <main className="screen-scroll">
      <TopBar title="Reserve a Table" />
      <div className="flex items-center justify-center gap-2 px-5 py-4">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={cn(
                'flex h-7 w-7 items-center justify-center rounded-full border-2 border-coffee font-mono text-xs',
                s <= step ? 'bg-rust text-cream' : 'bg-cream text-coffee-muted'
              )}
            >
              {s}
            </div>
            {s < 3 && <div className={cn('h-0.5 w-8', s < step ? 'bg-rust' : 'bg-coffee/20')} />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="flex flex-col gap-5 px-5 pb-6">
          {effectiveTable !== null && !editingTable && (
            <div className="flex items-center justify-between rounded-sign border-2 border-coffee bg-mustard/40 px-3 py-2.5">
              <span className="flex items-center gap-1.5 font-mono text-sm text-coffee">
                <MapPin size={15} /> Table {effectiveTable} selected
              </span>
              <button
                type="button"
                onClick={() => {
                  setTableInput(String(effectiveTable));
                  setEditingTable(true);
                }}
                className="font-mono text-xs uppercase tracking-wide text-rust underline underline-offset-2"
              >
                Change
              </button>
            </div>
          )}

          {(effectiveTable === null || editingTable) && (
            <label className="block">
              <span className="mb-1.5 flex items-center gap-1.5 font-display text-sm tracking-wide text-coffee">
                <MapPin size={16} /> Table number (optional)
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  value={tableInput}
                  onChange={(e) => setTableInput(e.target.value)}
                  placeholder="e.g. 5"
                  className="vintage-border w-full rounded-sign bg-cream-dark px-3 py-2.5 font-mono text-sm"
                />
                <Button type="button" variant="ghost" onClick={saveTableInput}>
                  Save
                </Button>
              </div>
            </label>
          )}

          <label className="block">
            <span className="mb-1.5 flex items-center gap-1.5 font-display text-sm tracking-wide text-coffee">
              <Users size={16} /> Party Size
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setPartySize((p) => Math.max(1, p - 1))}
                className="vintage-border h-11 w-11 rounded-sign font-display text-xl"
              >
                −
              </button>
              <span className="w-10 text-center font-mono text-lg">{partySize}</span>
              <button
                onClick={() => setPartySize((p) => Math.min(12, p + 1))}
                className="vintage-border h-11 w-11 rounded-sign font-display text-xl"
              >
                +
              </button>
            </div>
          </label>

          <label className="block">
            <span className="mb-1.5 flex items-center gap-1.5 font-display text-sm tracking-wide text-coffee">
              <CalendarDays size={16} /> Date
            </span>
            <input
              type="date"
              value={date}
              min={minDate}
              onChange={(e) => setDate(e.target.value)}
              className="vintage-border w-full rounded-sign bg-cream-dark px-3 py-2.5 font-mono text-sm"
            />
          </label>

          <div>
            <span className="mb-1.5 flex items-center gap-1.5 font-display text-sm tracking-wide text-coffee">
              <Clock size={16} /> Time
            </span>
            <div className="grid grid-cols-3 gap-2">
              {TIME_SLOTS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTime(t)}
                  className={cn(
                    'rounded-sign border-2 border-coffee py-2 font-mono text-sm',
                    time === t ? 'bg-coffee text-cream' : 'bg-cream-dark text-coffee'
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <Button size="lg" onClick={() => setStep(2)} className="mt-2 w-full">
            Continue
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col gap-5 px-5 pb-6">
          <label className="block">
            <span className="mb-1.5 font-display text-sm tracking-wide text-coffee">Name for the reservation</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              className="vintage-border w-full rounded-sign bg-cream-dark px-3 py-2.5 text-sm"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 flex items-center gap-1.5 font-display text-sm tracking-wide text-coffee">
              <StickyNote size={16} /> Notes (optional)
            </span>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Booth preference, allergies, celebration…"
              rows={3}
              className="vintage-border w-full rounded-sign bg-cream-dark px-3 py-2.5 text-sm"
            />
          </label>
          <div className="mt-2 flex gap-3">
            <Button variant="ghost" onClick={() => setStep(1)} className="flex-1">
              Back
            </Button>
            <Button onClick={() => setStep(3)} disabled={!name.trim()} className="flex-1">
              Review
            </Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="flex flex-col gap-4 px-5 pb-6">
          <div className="vintage-border rounded-card bg-cream-dark p-4">
            <dl className="flex flex-col gap-2 text-sm">
              <Row label="Name" value={name} />
              <Row label="Party" value={`${partySize} guest${partySize > 1 ? 's' : ''}`} />
              <Row
                label="Date"
                value={new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              />
              <Row label="Time" value={time} />
              {effectiveTable !== null && <Row label="Table" value={String(effectiveTable)} />}
              {notes && <Row label="Notes" value={notes} />}
            </dl>
          </div>
          {error && <p className="rounded-sign bg-rust/10 px-3 py-2 text-sm text-rust-dark">{error}</p>}
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => setStep(2)} className="flex-1">
              Back
            </Button>
            <Button onClick={handleConfirm} disabled={isSubmitting} className="flex-1">
              {isSubmitting ? 'Saving…' : 'Confirm'}
            </Button>
          </div>
        </div>
      )}
    </main>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-coffee/10 pb-2 last:border-0 last:pb-0">
      <dt className="text-coffee-muted">{label}</dt>
      <dd className="text-right font-medium text-coffee">{value}</dd>
    </div>
  );
}
