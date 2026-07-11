'use client';

import { useEffect, useState } from 'react';
import { Reservation } from '@/lib/mock-data';
import { getAllReservations, updateReservation } from '@/lib/reservations';
import { cn } from '@/lib/cn';

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    setReservations(getAllReservations());
  }, []);

  function handleStatusChange(id: string, status: 'pending' | 'confirmed' | 'cancelled') {
    updateReservation(id, { status });
    setReservations(getAllReservations());
  }

  return (
    <div className="p-5">
      <h2 className="mb-4 font-display text-xl text-coffee">Reservations</h2>
      <div className="flex flex-col gap-3">
        {reservations.map(res => {
          const isCancelled = res.status === 'cancelled';
          const isConfirmed = res.status === 'confirmed';
          return (
            <div key={res.id} className={cn("rounded-card border-2 border-coffee/10 p-4", isCancelled ? "bg-black/5 opacity-70" : "bg-white")}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-display text-lg text-coffee">{res.name}</p>
                  <p className="text-sm text-coffee-muted">Code: {res.confirmationCode}</p>
                  <p className="mt-2 font-mono text-xs text-coffee">
                    {res.date} at {res.time} &bull; Party of {res.partySize}
                    {res.table && ` \u2022 Table ${res.table}`}
                  </p>
                  {res.notes && (
                    <p className="mt-1 text-sm italic text-coffee-muted">"{res.notes}"</p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  {!isConfirmed && !isCancelled && (
                    <button 
                      onClick={() => handleStatusChange(res.id, 'confirmed')}
                      className="rounded-sign bg-coffee px-3 py-1 text-xs text-cream"
                    >
                      Confirm
                    </button>
                  )}
                  {isConfirmed && (
                    <span className="rounded-sign bg-green-900/10 px-3 py-1 text-center text-xs text-green-900">
                      Confirmed
                    </span>
                  )}
                  {!isCancelled && (
                    <button 
                      onClick={() => handleStatusChange(res.id, 'cancelled')}
                      className="rounded-sign bg-rust/10 px-3 py-1 text-xs text-rust-dark"
                    >
                      Cancel
                    </button>
                  )}
                  {isCancelled && (
                    <span className="rounded-sign bg-rust/10 px-3 py-1 text-center text-xs text-rust-dark">
                      Cancelled
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {reservations.length === 0 && (
          <p className="text-coffee-muted text-sm text-center">No reservations found.</p>
        )}
      </div>
    </div>
  );
}
