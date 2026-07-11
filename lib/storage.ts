'use client';

import { MenuItem, MENU_ITEMS } from './mock-data';
import { supabase } from './supabase';

export async function getMenuItems(): Promise<MenuItem[]> {
  const { data, error } = await supabase.from('menu_items').select('*');
  if (error || !data || data.length === 0) {
    // If empty, seed it
    const seeded = MENU_ITEMS.map(item => ({ ...item, isAvailable: item.isAvailable !== false }));
    for (const item of seeded) {
      await supabase.from('menu_items').insert({
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category,
        tag: item.tag,
        is_available: item.isAvailable
      });
    }
    return seeded;
  }
  return data.map(d => ({
    id: d.id,
    name: d.name,
    description: d.description || '',
    price: Number(d.price),
    category: d.category as any,
    tag: d.tag,
    isAvailable: d.is_available
  }));
}

export async function addMenuItem(item: MenuItem): Promise<void> {
  await supabase.from('menu_items').insert({
    id: item.id,
    name: item.name,
    description: item.description,
    price: item.price,
    category: item.category,
    tag: item.tag,
    is_available: item.isAvailable !== false
  });
}

export async function updateMenuItem(item: MenuItem): Promise<void> {
  await supabase.from('menu_items').update({
    name: item.name,
    description: item.description,
    price: item.price,
    category: item.category,
    tag: item.tag,
    is_available: item.isAvailable !== false
  }).eq('id', item.id);
}

export async function deleteMenuItem(id: string): Promise<void> {
  await supabase.from('menu_items').delete().eq('id', id);
}
