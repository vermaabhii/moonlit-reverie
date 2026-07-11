'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Order, getOrder } from '@/lib/ordering';
import { TopBar } from '@/components/TopBar';
import { Button } from '@/components/Button';
import Link from 'next/link';
import { CheckCircle2, Clock, ChefHat, PackageCheck, Coffee } from 'lucide-react';
import { cn } from '@/lib/cn';

export default function OrderStatusPage() {
  const { id } = useParams() as { id: string };
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrder();

    const channel = supabase
      .channel(`order-${id}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'orders', filter: `id=eq.${id}` },
        (payload) => {
          console.log('Order status updated!', payload);
          setOrder((prev) => prev ? { ...prev, status: payload.new.status } : null);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  async function loadOrder() {
    const o = await getOrder(id);
    setOrder(o);
    setLoading(false);
  }

  if (loading) {
    return (
      <main className="screen-scroll flex items-center justify-center">
        <p className="text-coffee-muted">Loading order...</p>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="screen-scroll flex flex-col items-center px-6 py-16 text-center">
        <TopBar title="Order Not Found" showBack />
        <p className="mt-10 text-sm text-coffee-muted">We couldn't find that order.</p>
        <Link href="/menu" className="mt-6 w-full">
          <Button className="w-full">Back to Menu</Button>
        </Link>
      </main>
    );
  }

  const steps = [
    { status: 'sent', label: 'Order Sent', icon: Clock },
    { status: 'preparing', label: 'Preparing', icon: ChefHat },
    { status: 'ready', label: 'Ready', icon: PackageCheck },
    { status: 'delivered', label: 'Delivered', icon: CheckCircle2 },
  ];

  const currentIndex = steps.findIndex((s) => s.status === order.status);

  return (
    <main className="screen-scroll">
      <TopBar title="Order Status" />
      
      <div className="px-6 py-8">
        <div className="flex flex-col items-center text-center mb-10">
          <Coffee size={48} className="text-rust mb-4" />
          <h1 className="font-display text-3xl tracking-wide text-coffee">Order {order.orderNumber}</h1>
          <p className="mt-1 text-sm text-coffee-muted">Table {order.table}</p>
        </div>

        <div className="relative mb-12">
          {/* Connecting line */}
          <div className="absolute left-[1.15rem] top-4 bottom-4 w-0.5 bg-coffee/10" />
          
          <div className="space-y-6 relative">
            {steps.map((step, idx) => {
              const isPast = idx < currentIndex;
              const isCurrent = idx === currentIndex;
              const isFuture = idx > currentIndex;
              
              const Icon = step.icon;
              
              return (
                <div key={step.status} className="flex items-center gap-4">
                  <div className={cn(
                    "relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2",
                    isPast ? "bg-rust border-rust text-cream" : 
                    isCurrent ? "bg-cream border-rust text-rust" : 
                    "bg-cream border-coffee/20 text-coffee/20"
                  )}>
                    <Icon size={18} />
                  </div>
                  <div className={cn(
                    "font-display text-lg tracking-wide",
                    isPast || isCurrent ? "text-coffee" : "text-coffee-muted"
                  )}>
                    {step.label}
                    {isCurrent && <span className="ml-2 text-xs font-sans font-normal text-rust animate-pulse">(Current)</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="vintage-border rounded-card bg-cream-dark p-5">
          <h2 className="font-display text-lg text-coffee mb-4 border-b-2 border-coffee/10 pb-2">Order Details</h2>
          <div className="space-y-2 mb-4">
            {order.lines.map((line, idx) => (
              <div key={idx} className="flex justify-between text-sm text-coffee">
                <span>{line.qty}x {line.name}</span>
                <span>${(line.price * line.qty).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between border-t-2 border-coffee/10 pt-3 font-display text-lg text-coffee">
            <span>Total</span>
            <span>${(order.total ?? 0).toFixed(2)}</span>
          </div>
        </div>

        <Link href={`/menu?table=${order.table}`} className="mt-8 block w-full">
          <Button className="w-full" variant="secondary">Order More</Button>
        </Link>
      </div>
    </main>
  );
}
