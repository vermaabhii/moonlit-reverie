'use client';

import { MenuItem } from './mock-data';
import { getMenuItems } from './storage';
import { supabase } from './supabase';

const TABLE_KEY = 'moonlit:active-table';
const CART_KEY_PREFIX = 'moonlit:cart:table-';
const ORDERS_KEY = 'moonlit:orders';

export const DEMO_TABLE_COUNT = 8;

const PRODUCTION_ORIGIN = 'https://moonlit-reverie.vercel.app';

function siteOrigin(): string {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }
  return PRODUCTION_ORIGIN;
}

// ---------- Table session ----------

export function getActiveTable(): number | null {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(TABLE_KEY);
  const table = raw ? Number(raw) : NaN;
  return Number.isInteger(table) && table > 0 ? table : null;
}

export function setActiveTable(table: number) {
  if (!Number.isInteger(table) || table <= 0) {
    throw new Error('A table number must be a positive whole number.');
  }
  window.localStorage.setItem(TABLE_KEY, String(table));
}

export function clearActiveTable() {
  window.localStorage.removeItem(TABLE_KEY);
}

export function parseTableCode(decodedText: string): number | null {
  const value = decodedText.trim();

  try {
    const url = new URL(value);
    const raw = url.searchParams.get('table');
    const num = raw ? Number(raw) : NaN;
    return Number.isInteger(num) && num > 0 ? num : null;
  } catch {
    return null;
  }
}

export function tableQrValue(table: number) {
  return `${siteOrigin()}/menu?table=${table}`;
}

// ---------- Cart ----------

export interface CartLine {
  itemId: string;
  qty: number;
}

function cartKey(table: number) {
  return `${CART_KEY_PREFIX}${table}`;
}

export function getCart(table: number): CartLine[] {
  if (typeof window === 'undefined') return [];
  const raw = window.localStorage.getItem(cartKey(table));
  if (!raw) return [];
  try {
    return JSON.parse(raw) as CartLine[];
  } catch {
    return [];
  }
}

function saveCart(table: number, lines: CartLine[]) {
  window.localStorage.setItem(cartKey(table), JSON.stringify(lines));
}

export function addToCart(table: number, itemId: string, qty = 1): CartLine[] {
  const lines = getCart(table);
  const existing = lines.find((l) => l.itemId === itemId);
  const next = existing
    ? lines.map((l) => (l.itemId === itemId ? { ...l, qty: l.qty + qty } : l))
    : [...lines, { itemId, qty }];
  saveCart(table, next);
  return next;
}

export function setLineQty(table: number, itemId: string, qty: number): CartLine[] {
  const lines = getCart(table);
  const next =
    qty <= 0 ? lines.filter((l) => l.itemId !== itemId) : lines.map((l) => (l.itemId === itemId ? { ...l, qty } : l));
  saveCart(table, next);
  return next;
}

export function clearCart(table: number) {
  window.localStorage.removeItem(cartKey(table));
}

export interface CartLineDetailed extends CartLine {
  item: MenuItem;
  lineTotal: number;
}

export async function getCartDetailed(table: number): Promise<CartLineDetailed[]> {
  const cart = getCart(table);
  if (cart.length === 0) return [];
  const items = await getMenuItems();
  
  return cart.map((line) => {
    const item = items.find((m) => m.id === line.itemId);
    if (!item) return null;
    return { ...line, item, lineTotal: item.price * line.qty };
  }).filter((l): l is CartLineDetailed => l !== null);
}

export async function getCartTotal(table: number): Promise<number> {
  const detailed = await getCartDetailed(table);
  return detailed.reduce((sum, l) => sum + l.lineTotal, 0);
}

export function getCartCount(table: number): number {
  return getCart(table).reduce((sum, l) => sum + l.qty, 0);
}

// ---------- Orders ----------

export type OrderStatus = 'sent' | 'preparing' | 'ready' | 'delivered';

export interface Order {
  id: string;
  orderNumber: string;
  table: number;
  userId: string | null;
  lines: { itemId: string; name: string; price: number; qty: number }[];
  notes?: string;
  total: number;
  status: OrderStatus;
  createdAt: string;
}

export async function getAllOrders(): Promise<Order[]> {
  const { data, error } = await supabase.from('orders').select('*, order_items(*)');
  if (error || !data) return [];
  return data.map(d => ({
    id: d.id,
    orderNumber: d.order_number,
    table: d.table,
    userId: d.user_id ?? null,
    lines: (d.order_items || []).map((l: any) => ({ itemId: l.menu_item_id, name: l.name, price: Number(l.price), qty: Number(l.qty) })),
    notes: d.notes,
    total: Number(d.total),
    status: d.status as OrderStatus,
    createdAt: d.created_at
  }));
}

export async function placeOrder(table: number, userId: string | null, notes?: string): Promise<{ok: true, order: Order} | {ok: false, error: string}> {
  let lines: CartLineDetailed[];
  try {
    lines = await getCartDetailed(table);
  } catch {
    return { ok: false, error: 'We could not load your cart. Please try again.' };
  }
  if (lines.length === 0) return { ok: false, error: 'Cart is empty' };
  // UUIDs work with both text and UUID primary-key columns in Supabase.
  const orderId = crypto.randomUUID();
  const orderNumber = `T${table}-${Math.floor(1000 + Math.random() * 9000)}`;
  const total = lines.reduce((sum, l) => sum + l.lineTotal, 0);
  const createdAt = new Date().toISOString();

  const { error: orderError } = await supabase.from('orders').insert({
    id: orderId,
    order_number: orderNumber,
    table,
    user_id: userId,
    notes,
    total,
    status: 'sent',
    created_at: createdAt
  });

  if (orderError) {
    return { ok: false, error: orderError.message };
  }

  const orderItemsData = lines.map((l) => ({
    order_id: orderId,
    menu_item_id: l.itemId,
    name: l.item.name,
    price: l.item.price,
    qty: l.qty
  }));

  const { error: itemsError } = await supabase.from('order_items').insert(orderItemsData);
  if (itemsError) {
    // Supabase client calls cannot span a transaction. Compensate for a failed
    // second write so the kitchen never sees an order without its items.
    const { error: removeItemsError } = await supabase.from('order_items').delete().eq('order_id', orderId);
    const { error: removeOrderError } = await supabase.from('orders').delete().eq('id', orderId);
    const rollbackFailed = removeItemsError || removeOrderError;
    return {
      ok: false,
      error: rollbackFailed
        ? 'Your order could not be completed. Please contact a staff member before trying again.'
        : 'Your order could not be completed. Please try again.',
    };
  }

  clearCart(table);

  return {
    ok: true,
    order: {
      id: orderId,
      orderNumber,
      table,
      userId,
      lines: lines.map((l) => ({ itemId: l.itemId, name: l.item.name, price: l.item.price, qty: l.qty })),
      notes,
      total,
      status: 'sent',
      createdAt,
    }
  };
}

export async function getOrder(id: string): Promise<Order | null> {
  const orders = await getAllOrders();
  return orders.find((o) => o.id === id) ?? null;
}

export async function getOrdersForTable(table: number): Promise<Order[]> {
  const orders = await getAllOrders();
  return orders
    .filter((o) => o.table === table)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<void> {
  const { error } = await supabase.from('orders').update({ status }).eq('id', id);
  if (error) throw new Error(error.message);
}
