'use client';

import { DEMO_USER, DEMO_ADMIN } from './mock-data';

const SESSION_KEY = 'moonlit:session';
const USERS_KEY = 'moonlit:users';

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  isAdmin?: boolean;
}

interface StoredCredential {
  id: string;
  name: string;
  email: string;
  password: string;
  isAdmin?: boolean;
}

function readUsers(): StoredCredential[] {
  if (typeof window === 'undefined') return [];
  const raw = window.localStorage.getItem(USERS_KEY);
  if (!raw) {
    const seeded = [DEMO_USER, DEMO_ADMIN];
    window.localStorage.setItem(USERS_KEY, JSON.stringify(seeded));
    return seeded;
  }
  try {
    return JSON.parse(raw) as StoredCredential[];
  } catch {
    return [DEMO_USER, DEMO_ADMIN];
  }
}

function writeUsers(users: StoredCredential[]) {
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getSession(): SessionUser | null {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}

export function signIn(email: string, password: string): { ok: true } | { ok: false; error: string } {
  const users = readUsers();
  const match = users.find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
  );
  if (!match) {
    return { ok: false, error: 'That email and password combination doesn\u2019t match our records.' };
  }
  const session: SessionUser = { id: match.id, name: match.name, email: match.email, isAdmin: match.isAdmin };
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return { ok: true };
}

export function signUp(
  name: string,
  email: string,
  password: string
): { ok: true } | { ok: false; error: string } {
  const users = readUsers();
  if (users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())) {
    return { ok: false, error: 'An account with that email already exists.' };
  }
  const id = `user-${Date.now()}`;
  const newUser: StoredCredential = { id, name: name.trim(), email: email.trim(), password };
  writeUsers([...users, newUser]);
  const session: SessionUser = { id, name: newUser.name, email: newUser.email };
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return { ok: true };
}

export function signOut() {
  window.localStorage.removeItem(SESSION_KEY);
}

export function fillDemoCredentials(): { email: string; password: string } {
  return { email: DEMO_USER.email, password: DEMO_USER.password };
}

export function fillAdminDemoCredentials(): { email: string; password: string } {
  return { email: DEMO_ADMIN.email, password: DEMO_ADMIN.password };
}
