'use client';

import { useEffect, useState } from 'react';
import { Reservation } from '@/lib/mock-data';
import { getAllReservations, updateReservation } from '@/lib/reservations';
import { cn } from '@/lib/cn';

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadReservations();
  }, []);

  async function loadReservations() {
    setLoading(true);
    setReservations(await getAllReservations());
    setLoading(false);
  }

  async function handleStatusChange(id: string, status: 'pending' | 'confirmed' | 'cancelled') {
    setError(null);
    try {
      await updateReservation(id, { status });
      await loadReservations();
    } catch {
      setError('Could not update this reservation. Please try again.');
    }
  }

  return (
    <div className="p-8">
      <h2 className="mb-6 text-2xl font-bold tracking-tight text-neutral-900">Reservations</h2>
      {error && <p className="mb-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      
      {loading ? (
        <div className="flex h-32 items-center justify-center rounded-lg border border-neutral-200 border-dashed">
          <span className="text-sm text-neutral-500">Loading reservations...</span>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reservations.map(res => {
            const isCancelled = res.status === 'cancelled';
            const isConfirmed = res.status === 'confirmed';
            return (
              <div key={res.id} className={cn("flex flex-col rounded-lg border border-neutral-200 bg-white shadow-sm overflow-hidden", isCancelled && "opacity-75 bg-neutral-50")}>
                <div className="bg-neutral-50 px-4 py-3 border-b border-neutral-200 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-neutral-900">{res.name}</h3>
                    <p className="text-xs text-neutral-500 font-mono mt-0.5">Code: {res.confirmationCode}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {isConfirmed && (
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                        Confirmed
                      </span>
                    )}
                    {isCancelled && (
                      <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                        Cancelled
                      </span>
                    )}
                    {!isConfirmed && !isCancelled && (
                      <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                        Pending
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex-1 p-4 space-y-3">
                  <div className="text-sm text-neutral-700">
                    <p><strong>Date:</strong> {res.date} at {res.time}</p>
                    <p><strong>Party Size:</strong> {res.partySize}</p>
                    {res.table && <p><strong>Assigned Table:</strong> {res.table}</p>}
                  </div>
                  {res.notes && (
                    <div className="mt-2 rounded-md bg-yellow-50 p-3 text-sm italic text-yellow-800">
                      "{res.notes}"
                    </div>
                  )}
                </div>

                <div className="bg-neutral-50 px-4 py-3 border-t border-neutral-200 flex justify-end gap-2">
                  {!isConfirmed && !isCancelled && (
                    <button 
                      onClick={() => handleStatusChange(res.id, 'confirmed')}
                      className="rounded-md bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-neutral-800"
                    >
                      Confirm
                    </button>
                  )}
                  {!isCancelled && (
                    <button 
                      onClick={() => handleStatusChange(res.id, 'cancelled')}
                      className="rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          {reservations.length === 0 && (
            <div className="col-span-full rounded-lg border-2 border-dashed border-neutral-300 p-12 text-center">
              <h3 className="mt-2 text-sm font-semibold text-neutral-900">No reservations</h3>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
