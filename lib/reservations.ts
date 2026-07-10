'use client';

import { Reservation, SEED_RESERVATIONS } from './mock-data';

const RES_KEY = 'moonlit:reservations';

function readAll(): Reservation[] {
  if (typeof window === 'undefined') return [];
  const raw = window.localStorage.getItem(RES_KEY);
  if (!raw) {
    window.localStorage.setItem(RES_KEY, JSON.stringify(SEED_RESERVATIONS));
    return SEED_RESERVATIONS;
  }
  try {
    return JSON.parse(raw) as Reservation[];
  } catch {
    return SEED_RESERVATIONS;
  }
}

function writeAll(reservations: Reservation[]) {
  window.localStorage.setItem(RES_KEY, JSON.stringify(reservations));
}

export function getReservationsForUser(userId: string): Reservation[] {
  return readAll()
    .filter((r) => r.userId === userId)
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
}

export function createReservation(input: Omit<Reservation, 'id' | 'confirmationCode'>): Reservation {
  const all = readAll();
  const reservation: Reservation = {
    ...input,
    id: `res-${Date.now()}`,
    confirmationCode: `MR-${Math.floor(1000 + Math.random() * 9000)}`,
  };
  writeAll([...all, reservation]);
  return reservation;
}

export function cancelReservation(id: string) {
  writeAll(readAll().filter((r) => r.id !== id));
}
