'use client';

import { supabase } from './supabase';

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  isAdmin?: boolean;
}

export async function getSession(): Promise<SessionUser | null> {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error || !session) return null;

  return {
    id: session.user.id,
    name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
    email: session.user.email || '',
    isAdmin: session.user.user_metadata?.is_admin === true
  };
}

export async function signIn(email: string, password: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { ok: false, error: error.message };
  }
  return { ok: true };
}

export async function signUp(
  name: string,
  email: string,
  password: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        is_admin: false,
      }
    }
  });
  if (error) {
    return { ok: false, error: error.message };
  }
  return { ok: true };
}

export async function signOut() {
  await supabase.auth.signOut();
}
