'use client';

import { useEffect, useState } from 'react';
import { MenuItem, MenuCategory } from '@/lib/mock-data';
import { getMenuItems, updateMenuItem, deleteMenuItem, addMenuItem } from '@/lib/storage';
import { Edit, Trash, Plus, Check, X } from 'lucide-react';
import { cn } from '@/lib/cn';

export default function AdminMenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<MenuItem>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadItems();
  }, []);

  async function loadItems() {
    setLoading(true);
    setItems(await getMenuItems());
    setLoading(false);
  }

  async function handleSave() {
    if (isAdding) {
      const newItem: MenuItem = {
        id: `item-${Date.now()}`,
        name: editForm.name || 'New Item',
        description: editForm.description || '',
        price: editForm.price || 0,
        category: (editForm.category as MenuCategory) || 'food',
        isAvailable: editForm.isAvailable !== false,
      };
      await addMenuItem(newItem);
    } else if (editingId) {
      const currentItem = items.find(i => i.id === editingId);
      if (currentItem) {
        await updateMenuItem({ ...currentItem, ...editForm } as MenuItem);
      }
    }
    await loadItems();
    setEditingId(null);
    setIsAdding(false);
  }

  function handleEdit(item: MenuItem) {
    setEditingId(item.id);
    setEditForm(item);
    setIsAdding(false);
  }

  async function handleDelete(id: string) {
    if (confirm('Are you sure you want to delete this item?')) {
      await deleteMenuItem(id);
      await loadItems();
    }
  }

  async function toggleAvailability(item: MenuItem) {
    const updated = { ...item, isAvailable: item.isAvailable === false ? true : false };
    await updateMenuItem(updated);
    await loadItems();
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-neutral-900">Menu Management</h2>
        <button 
          onClick={() => {
            setIsAdding(true);
            setEditingId(null);
            setEditForm({ price: 0, category: 'coffee', isAvailable: true });
          }}
          className="flex items-center gap-1 rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
        >
          <Plus size={16} /> Add Item
        </button>
      </div>

      {(isAdding || editingId) && (
        <div className="mb-6 rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-lg font-bold text-neutral-900">{isAdding ? 'Add Menu Item' : 'Edit Menu Item'}</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <label className="text-sm font-medium text-neutral-700">Name</label>
              <input 
                type="text" 
                value={editForm.name || ''} 
                onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-neutral-700">Category</label>
              <select 
                value={editForm.category || 'food'} 
                onChange={e => setEditForm({ ...editForm, category: e.target.value as MenuCategory })}
                className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500"
              >
                <option value="coffee">Coffee</option>
                <option value="food">Food</option>
                <option value="pastries">Pastries</option>
              </select>
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-medium text-neutral-700">Description</label>
              <textarea 
                value={editForm.description || ''} 
                onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500"
                rows={2}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-neutral-700">Price ($)</label>
              <input 
                type="number" 
                step="0.01"
                value={editForm.price || ''} 
                onChange={e => setEditForm({ ...editForm, price: parseFloat(e.target.value) })}
                className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500"
              />
            </div>
          </div>
          <div className="mt-5 flex gap-3">
            <button 
              onClick={handleSave} 
              className="flex items-center justify-center gap-1 rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
            >
              <Check size={16} /> Save
            </button>
            <button 
              onClick={() => {
                setEditingId(null);
                setIsAdding(false);
              }} 
              className="flex items-center justify-center gap-1 rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
            >
              <X size={16} /> Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex h-32 items-center justify-center rounded-lg border border-neutral-200 border-dashed">
          <span className="text-sm text-neutral-500">Loading menu items...</span>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="px-4 py-3 font-medium text-neutral-900">Item</th>
                <th className="px-4 py-3 font-medium text-neutral-900">Category</th>
                <th className="px-4 py-3 font-medium text-neutral-900">Price</th>
                <th className="px-4 py-3 font-medium text-neutral-900 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {items.map(item => (
                <tr key={item.id} className={cn("hover:bg-neutral-50 transition-colors", item.isAvailable === false && 'bg-neutral-50/50 opacity-60')}>
                  <td className="px-4 py-3">
                    <p className="font-medium text-neutral-900">{item.name}</p>
                    {item.description && <p className="text-xs text-neutral-500 truncate max-w-xs">{item.description}</p>}
                  </td>
                  <td className="px-4 py-3 capitalize text-neutral-600">{item.category}</td>
                  <td className="px-4 py-3 text-neutral-600">${item.price.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right flex items-center justify-end gap-2">
                    <button 
                      onClick={() => toggleAvailability(item)}
                      className={cn("rounded-md px-2.5 py-1 text-xs font-medium border", item.isAvailable !== false ? "border-neutral-300 text-neutral-700 bg-white hover:bg-neutral-50" : "border-neutral-200 bg-neutral-100 text-neutral-500")}
                    >
                      {item.isAvailable !== false ? 'Available' : 'Hidden'}
                    </button>
                    <button onClick={() => handleEdit(item)} className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded-md">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="p-1.5 text-red-400 hover:text-red-700 rounded-md">
                      <Trash size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
