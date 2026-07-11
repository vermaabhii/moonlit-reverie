'use client';

import { useEffect, useState } from 'react';
import { Order, OrderStatus, getAllOrders, updateOrderStatus } from '@/lib/ordering';
import { cn } from '@/lib/cn';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    // Sort by newest first
    const list = getAllOrders().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    setOrders(list);
  }, []);

  function handleStatusChange(id: string, status: OrderStatus) {
    updateOrderStatus(id, status);
    setOrders(getAllOrders().sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
  }

  const statusColors: Record<OrderStatus, string> = {
    sent: 'bg-rust/10 text-rust-dark',
    preparing: 'bg-yellow-500/10 text-yellow-700',
    ready: 'bg-green-500/10 text-green-700',
    delivered: 'bg-black/5 text-coffee-muted',
  };

  return (
    <div className="p-5">
      <h2 className="mb-4 font-display text-xl text-coffee">Orders</h2>
      <div className="flex flex-col gap-3">
        {orders.map((order) => {
          return (
            <div key={order.id} className="rounded-card border-2 border-coffee/10 bg-white p-4">
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <h3 className="font-display text-lg text-coffee">Order {order.orderNumber}</h3>
                  <p className="font-mono text-xs text-coffee-muted">Table {order.table}</p>
                  <p className="font-mono text-xs text-coffee-muted">
                    {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={cn('rounded-sign px-3 py-1 font-mono text-xs uppercase', statusColors[order.status])}>
                    {order.status}
                  </span>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                    className="mt-1 rounded border border-coffee/20 bg-cream px-2 py-1 text-xs outline-none"
                  >
                    <option value="sent">Sent</option>
                    <option value="preparing">Preparing</option>
                    <option value="ready">Ready</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </div>
              </div>

              <div className="mb-3 border-t-2 border-coffee/5 pt-3">
                {order.lines.map((line, idx) => (
                  <div key={idx} className="flex justify-between text-sm text-coffee">
                    <span>{line.qty}x {line.name}</span>
                    <span>${(line.price * line.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {order.notes && (
                <div className="mb-3 rounded bg-cream-dark p-2 text-sm italic text-coffee-muted">
                  "{order.notes}"
                </div>
              )}

              <div className="flex justify-between border-t-2 border-coffee/5 pt-3 font-display text-lg text-coffee">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          );
        })}

        {orders.length === 0 && (
          <p className="text-center text-sm text-coffee-muted">No orders found.</p>
        )}
      </div>
    </div>
  );
}
