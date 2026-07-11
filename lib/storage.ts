'use client';

import { MenuItem } from './mock-data';
import { supabase } from './supabase';

export async function getMenuItems(): Promise<MenuItem[]> {
  const { data, error } = await supabase.from('menu_items').select('*');
  if (error) {
    throw new Error(error.message);
  }
  return (data ?? []).map(d => ({
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
  const { error } = await supabase.from('menu_items').insert({
    id: item.id,
    name: item.name,
    description: item.description,
    price: item.price,
    category: item.category,
    tag: item.tag,
    is_available: item.isAvailable !== false
  });
  if (error) throw new Error(error.message);
}

export async function updateMenuItem(item: MenuItem): Promise<void> {
  const { error } = await supabase.from('menu_items').update({
    name: item.name,
    description: item.description,
    price: item.price,
    category: item.category,
    tag: item.tag,
    is_available: item.isAvailable !== false
  }).eq('id', item.id);
  if (error) throw new Error(error.message);
}

export async function deleteMenuItem(id: string): Promise<void> {
  const { error } = await supabase.from('menu_items').delete().eq('id', id);
  if (error) throw new Error(error.message);
}
