'use client';

import { useEffect, useState } from 'react';
import { MenuItem, MenuCategory } from '@/lib/mock-data';
import { getMenuItems, updateMenuItem, deleteMenuItem, addMenuItem } from '@/lib/storage';
import { Button } from '@/components/Button';
import { Edit, Trash, Plus, Check, X } from 'lucide-react';
import { cn } from '@/lib/cn';

export default function AdminMenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<MenuItem>>({});
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    setItems(getMenuItems());
  }, []);

  function handleSave() {
    if (isAdding) {
      const newItem: MenuItem = {
        id: `item-${Date.now()}`,
        name: editForm.name || 'New Item',
        description: editForm.description || '',
        price: editForm.price || 0,
        category: (editForm.category as MenuCategory) || 'food',
        isAvailable: editForm.isAvailable !== false,
      };
      addMenuItem(newItem);
    } else if (editingId) {
      const currentItem = items.find(i => i.id === editingId);
      if (currentItem) {
        updateMenuItem({ ...currentItem, ...editForm } as MenuItem);
      }
    }
    setItems(getMenuItems());
    setEditingId(null);
    setIsAdding(false);
  }

  function handleEdit(item: MenuItem) {
    setEditingId(item.id);
    setEditForm(item);
    setIsAdding(false);
  }

  function handleDelete(id: string) {
    deleteMenuItem(id);
    setItems(getMenuItems());
  }

  function toggleAvailability(item: MenuItem) {
    const updated = { ...item, isAvailable: item.isAvailable === false ? true : false };
    updateMenuItem(updated);
    setItems(getMenuItems());
  }

  return (
    <div className="p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-xl text-coffee">Menu Items</h2>
        <Button onClick={() => {
          setIsAdding(true);
          setEditingId(null);
          setEditForm({ price: 0, category: 'coffee', isAvailable: true });
        }}>
          <Plus size={16} className="mr-1" /> Add
        </Button>
      </div>

      {(isAdding || editingId) && (
        <div className="mb-6 rounded-card border-2 border-coffee bg-cream-dark p-4">
          <h3 className="mb-3 font-display text-lg">{isAdding ? 'Add Menu Item' : 'Edit Menu Item'}</h3>
          <div className="flex flex-col gap-3">
            <label>
              <span className="mb-1 block text-sm">Name</span>
              <input 
                type="text" 
                value={editForm.name || ''} 
                onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full rounded-sign border-2 border-coffee/20 px-3 py-2"
              />
            </label>
            <label>
              <span className="mb-1 block text-sm">Description</span>
              <textarea 
                value={editForm.description || ''} 
                onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                className="w-full rounded-sign border-2 border-coffee/20 px-3 py-2"
              />
            </label>
            <div className="flex gap-3">
              <label className="flex-1">
                <span className="mb-1 block text-sm">Price</span>
                <input 
                  type="number" 
                  step="0.01"
                  value={editForm.price || ''} 
                  onChange={e => setEditForm({ ...editForm, price: parseFloat(e.target.value) })}
                  className="w-full rounded-sign border-2 border-coffee/20 px-3 py-2"
                />
              </label>
              <label className="flex-1">
                <span className="mb-1 block text-sm">Category</span>
                <select 
                  value={editForm.category || 'food'} 
                  onChange={e => setEditForm({ ...editForm, category: e.target.value as MenuCategory })}
                  className="w-full rounded-sign border-2 border-coffee/20 px-3 py-2"
                >
                  <option value="coffee">Coffee</option>
                  <option value="food">Food</option>
                  <option value="pastries">Pastries</option>
                </select>
              </label>
            </div>
            <div className="mt-2 flex gap-2">
              <Button onClick={handleSave} className="flex-1">
                <Check size={16} className="mr-1" /> Save
              </Button>
              <Button variant="ghost" onClick={() => {
                setEditingId(null);
                setIsAdding(false);
              }} className="flex-1">
                <X size={16} className="mr-1" /> Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {items.map(item => (
          <div key={item.id} className={cn("flex items-center justify-between rounded-card border-2 border-coffee/10 p-3", item.isAvailable === false ? 'opacity-60 bg-black/5' : 'bg-white')}>
            <div>
              <p className="font-display text-lg text-coffee">{item.name}</p>
              <p className="text-sm text-coffee-muted">${item.price.toFixed(2)} &bull; {item.category}</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => toggleAvailability(item)}
                className={cn("rounded-sign px-3 py-1 text-xs font-mono", item.isAvailable !== false ? "bg-rust/10 text-rust" : "bg-coffee text-cream")}
              >
                {item.isAvailable !== false ? 'Hide' : 'Show'}
              </button>
              <button onClick={() => handleEdit(item)} className="p-2 text-coffee-muted active:text-coffee">
                <Edit size={18} />
              </button>
              <button onClick={() => handleDelete(item.id)} className="p-2 text-rust-dark active:text-rust">
                <Trash size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
