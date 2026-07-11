'use client';

import { useEffect, useState } from 'react';
import { Order, OrderStatus, getAllOrders, updateOrderStatus } from '@/lib/ordering';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/cn';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();

    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          console.log('Realtime change received!', payload);
          loadOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function loadOrders() {
    setLoading(true);
    const list = await getAllOrders();
    setOrders(list.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
    setLoading(false);
  }

  async function handleStatusChange(id: string, status: OrderStatus) {
    await updateOrderStatus(id, status);
    // Real-time listener will fetch the latest
  }

  const statusColors: Record<OrderStatus, string> = {
    sent: 'bg-red-100 text-red-800',
    preparing: 'bg-yellow-100 text-yellow-800',
    ready: 'bg-green-100 text-green-800',
    delivered: 'bg-gray-100 text-gray-600',
  };

  const filteredOrders = filterStatus === 'all' ? orders : orders.filter(o => o.status === filterStatus);

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-neutral-900">Live Orders</h2>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-neutral-600">Filter:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500"
          >
            <option value="all">All</option>
            <option value="sent">Sent</option>
            <option value="preparing">Preparing</option>
            <option value="ready">Ready</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>
      </div>
      
      {loading ? (
        <div className="flex h-32 items-center justify-center rounded-lg border border-neutral-200 border-dashed">
          <span className="text-sm text-neutral-500">Loading orders...</span>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredOrders.map((order) => {
          return (
            <div key={order.id} className="flex flex-col rounded-lg border border-neutral-200 bg-white shadow-sm overflow-hidden">
              <div className="bg-neutral-50 px-4 py-3 border-b border-neutral-200 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-neutral-900">Order {order.orderNumber}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="inline-flex items-center rounded-full bg-neutral-200 px-2 py-0.5 text-xs font-medium text-neutral-800">
                      Table {order.table}
                    </span>
                    <span className="text-xs text-neutral-500">
                      {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium uppercase', statusColors[order.status])}>
                    {order.status}
                  </span>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                    className="rounded-md border border-neutral-300 bg-white px-2 py-1 text-xs font-medium text-neutral-700 shadow-sm outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500"
                  >
                    <option value="sent">Mark Sent</option>
                    <option value="preparing">Mark Preparing</option>
                    <option value="ready">Mark Ready</option>
                    <option value="delivered">Mark Delivered</option>
                  </select>
                </div>
              </div>

              <div className="flex-1 p-4">
                <div className="space-y-3 border-b border-neutral-100 pb-4">
                  {order.lines.map((line, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="font-medium text-neutral-700">{line.qty}x {line.name}</span>
                      <span className="text-neutral-500">${(line.price * line.qty).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {order.notes && (
                  <div className="mt-4 rounded-md bg-yellow-50 p-3 text-sm italic text-yellow-800">
                    "{order.notes}"
                  </div>
                )}
              </div>

              <div className="bg-neutral-50 px-4 py-3 border-t border-neutral-200 flex justify-between font-bold text-neutral-900">
                <span>Total</span>
                <span>${(order.total ?? 0).toFixed(2)}</span>
              </div>
            </div>
          );
        })}

        {filteredOrders.length === 0 && (
          <div className="col-span-full rounded-lg border-2 border-dashed border-neutral-300 p-12 text-center">
            <h3 className="mt-2 text-sm font-semibold text-neutral-900">No orders</h3>
            <p className="mt-1 text-sm text-neutral-500">
              There are no orders matching your current filter.
            </p>
          </div>
        )}
      </div>
      )}
    </div>
  );
}
