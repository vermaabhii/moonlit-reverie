'use client';

import { Reservation } from './mock-data';
import { supabase } from './supabase';

export async function getAllReservations(): Promise<Reservation[]> {
  const { data, error } = await supabase.from('reservations').select('*');
  if (error || !data) return [];
  return data.map(d => ({
    id: d.id,
    userId: d.user_id,
    name: d.name,
    partySize: d.party_size,
    date: d.date,
    time: d.time,
    notes: d.notes,
    confirmationCode: d.confirmation_code,
    table: d.table,
    status: d.status as any
  })).sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));
}



export async function getReservationsForUser(userId: string): Promise<Reservation[]> {
  const all = await getAllReservations();
  return all.filter((r) => r.userId === userId);
}

export async function createReservation(input: Omit<Reservation, 'id' | 'confirmationCode'>): Promise<Reservation> {
  const reservation: Reservation = {
    ...input,
    id: `res-${Date.now()}`,
    confirmationCode: `MR-${Math.floor(1000 + Math.random() * 9000)}`,
    status: 'pending'
  };
  await supabase.from('reservations').insert({
    id: reservation.id,
    user_id: reservation.userId,
    name: reservation.name,
    party_size: reservation.partySize,
    date: reservation.date,
    time: reservation.time,
    notes: reservation.notes,
    confirmation_code: reservation.confirmationCode,
    table: reservation.table,
    status: reservation.status
  });
  return reservation;
}

export async function cancelReservation(id: string): Promise<void> {
  await supabase.from('reservations').delete().eq('id', id);
}

export async function updateReservation(id: string, updates: Partial<Reservation>): Promise<void> {
  await supabase.from('reservations').update(updates).eq('id', id);
}
