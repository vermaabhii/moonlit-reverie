'use client';

import { MenuItem, MENU_ITEMS } from './mock-data';

const MENU_KEY = 'moonlit:menu';

export function getMenuItems(): MenuItem[] {
  if (typeof window === 'undefined') return [];
  const raw = window.localStorage.getItem(MENU_KEY);
  if (!raw) {
    // Seed with mock data
    const seeded = MENU_ITEMS.map(item => ({ ...item, isAvailable: item.isAvailable !== false }));
    window.localStorage.setItem(MENU_KEY, JSON.stringify(seeded));
    return seeded;
  }
  try {
    return JSON.parse(raw) as MenuItem[];
  } catch {
    return MENU_ITEMS;
  }
}

export function saveMenuItems(items: MenuItem[]) {
  window.localStorage.setItem(MENU_KEY, JSON.stringify(items));
}

export function addMenuItem(item: MenuItem) {
  const items = getMenuItems();
  saveMenuItems([...items, item]);
}

export function updateMenuItem(item: MenuItem) {
  const items = getMenuItems();
  const next = items.map((i) => (i.id === item.id ? item : i));
  saveMenuItems(next);
}

export function deleteMenuItem(id: string) {
  const items = getMenuItems();
  saveMenuItems(items.filter((i) => i.id !== id));
}
