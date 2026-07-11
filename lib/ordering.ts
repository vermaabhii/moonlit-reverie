'use client';

import { MenuItem } from './mock-data';
import { getMenuItems } from './storage';

const TABLE_KEY = 'moonlit:active-table';
const CART_KEY_PREFIX = 'moonlit:cart:table-';
const ORDERS_KEY = 'moonlit:orders';

/** Legacy prefix format ("MOONLIT:TABLE:5") — still accepted when scanned, no longer printed. */
export const TABLE_QR_PREFIX = 'MOONLIT:TABLE:';
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
  return raw ? Number(raw) : null;
}

export function setActiveTable(table: number) {
  window.localStorage.setItem(TABLE_KEY, String(table));
}

export function clearActiveTable() {
  window.localStorage.removeItem(TABLE_KEY);
}

export function parseTableCode(decodedText: string): number | null {
  const value = decodedText.trim();

  if (value.startsWith(TABLE_QR_PREFIX)) {
    const num = Number(value.slice(TABLE_QR_PREFIX.length));
    return Number.isInteger(num) && num > 0 ? num : null;
  }

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

export function getCartDetailed(table: number): CartLineDetailed[] {
  return getCart(table)
    .map((line) => {
      const items = getMenuItems();
      const item = items.find((m) => m.id === line.itemId);
      if (!item) return null;
      return { ...line, item, lineTotal: item.price * line.qty };
    })
    .filter((l): l is CartLineDetailed => l !== null);
}

export function getCartTotal(table: number): number {
  return getCartDetailed(table).reduce((sum, l) => sum + l.lineTotal, 0);
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
  userId: string;
  lines: { itemId: string; name: string; price: number; qty: number }[];
  notes?: string;
  total: number;
  status: OrderStatus;
  createdAt: string;
}

export function getAllOrders(): Order[] {
  if (typeof window === 'undefined') return [];
  const raw = window.localStorage.getItem(ORDERS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Order[];
  } catch {
    return [];
  }
}

export function writeOrders(orders: Order[]) {
  window.localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

export function placeOrder(table: number, userId: string, notes?: string): Order | null {
  const lines = getCartDetailed(table);
  if (lines.length === 0) return null;
  const order: Order = {
    id: `order-${Date.now()}`,
    orderNumber: `T${table}-${Math.floor(1000 + Math.random() * 9000)}`,
    table,
    userId,
    lines: lines.map((l) => ({ itemId: l.itemId, name: l.item.name, price: l.item.price, qty: l.qty })),
    notes,
    total: lines.reduce((sum, l) => sum + l.lineTotal, 0),
    status: 'sent',
    createdAt: new Date().toISOString(),
  };
  writeOrders([...getAllOrders(), order]);
  clearCart(table);
  return order;
}

export function getOrder(id: string): Order | null {
  return getAllOrders().find((o) => o.id === id) ?? null;
}

export function getOrdersForTable(table: number): Order[] {
  return getAllOrders()
    .filter((o) => o.table === table)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function updateOrderStatus(id: string, status: OrderStatus) {
  const all = getAllOrders();
  const next = all.map(o => o.id === id ? { ...o, status } : o);
  writeOrders(next);
}