'use client';

import { useState, useEffect } from 'react';
import { Edit, Save, X, Plus, Trash2 } from 'lucide-react';
import { finalCallGirlsApi } from '@/services/api';

const STORAGE_KEY = 'finalCallGirlsData';

interface TableData {
  id: string;
  name: string;
  rate: string;
  whatsapp: string;
}

export function FinalCallGirlsTable() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [data, setData] = useState<TableData[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<TableData>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [newRow, setNewRow] = useState<Omit<TableData, 'id'>>({ 
    name: 'Hanny Bhaiya', 
    rate: '$50', 
    whatsapp: '098989898' 
  });

  // Load data and check admin status on component mount
  useEffect(() => {
    const load = async () => {
      try {
        const items = await finalCallGirlsApi.getAll();
        const mapped: TableData[] = items.map((i: any) => ({ id: i._id, name: i.name, rate: i.rate, whatsapp: i.whatsapp }));
        if (mapped.length) {
          setData(mapped);
        } else {
          // Fallback to localStorage or defaults
          const savedData = localStorage.getItem(STORAGE_KEY);
          if (savedData) {
            setData(JSON.parse(savedData));
          } else {
            setData([
              { id: '1', name: 'Hanny Bhaiya', rate: '$50', whatsapp: '098989898' },
              { id: '2', name: 'Priya Sharma', rate: '$60', whatsapp: '098989899' },
              { id: '3', name: 'Neha Kapoor', rate: '$70', whatsapp: '098989900' },
            ]);
          }
        }
      } catch (e) {
        console.error('Failed to load final call girls', e);
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
          setData(JSON.parse(savedData));
        }
      }
      const admin = localStorage.getItem('isAdminAuthenticated') === 'true';
      setIsAdmin(admin);
    };
    load();
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    if (data.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, [data]);

  const handleEdit = (id: string) => {
    setEditingId(id);
    const itemToEdit = data.find(item => item.id === id);
    if (itemToEdit) {
      setEditData({ ...itemToEdit });
    }
  };

  const handleSave = async (id: string) => {
    try {
      const updated = await finalCallGirlsApi.update(id, {
        name: editData.name,
        rate: editData.rate,
        whatsapp: editData.whatsapp,
      });
      setData(data.map(item => item.id === id ? ({ id: updated._id, name: updated.name, rate: updated.rate, whatsapp: updated.whatsapp }) : item));
      setEditingId(null);
      setEditData({});
    } catch (e) {
      console.error('Failed to save entry', e);
    }
  };

  const handleAdd = () => {
    const create = async () => {
      if (newRow.name && newRow.rate && newRow.whatsapp) {
        try {
          const created = await finalCallGirlsApi.create(newRow);
          setData([...data, { id: created._id, name: created.name, rate: created.rate, whatsapp: created.whatsapp }]);
          setNewRow({ name: 'Hanny Bhaiya', rate: '$50', whatsapp: '098989898' });
          setIsAdding(false);
        } catch (e) {
          console.error('Failed to add entry', e);
        }
      }
    };
    create();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this entry?')) {
      const del = async () => {
        try {
          await finalCallGirlsApi.delete(id);
          setData(data.filter(item => item.id !== id));
        } catch (e) {
          console.error('Failed to delete entry', e);
        }
      };
      del();
    }
  };

  return (
    <div className="mt-8">
      <div className="overflow-x-auto rounded-xl shadow-2xl">
        <table className="w-full bg-white">
          <thead className="bg-gradient-to-r from-pink-600 to-rose-600 text-white">
            <tr>
              <th className="p-4 md:p-5 text-left font-bold text-sm md:text-base">Call Girl Name</th>
              <th className="p-4 md:p-5 text-left font-bold text-sm md:text-base">Rates</th>
              <th className="p-4 md:p-5 text-left font-bold text-sm md:text-base">Whatsapp</th>
              {isAdmin && (
                <th className="p-4 md:p-5 text-right font-bold text-sm md:text-base">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-pink-50 transition-colors">
                <td className="border border-pink-200 p-4 md:p-5 font-semibold text-purple-800">
                  {editingId === item.id ? (
                    <input
                      type="text"
                      value={editData.name || item.name}
                      onChange={(e) => setEditData({...editData, name: e.target.value})}
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    item.name
                  )}
                </td>
                <td className="border border-pink-200 p-4 md:p-5 text-green-600 font-bold">
                  {editingId === item.id ? (
                    <input
                      type="text"
                      value={editData.rate || item.rate}
                      onChange={(e) => setEditData({...editData, rate: e.target.value})}
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    item.rate
                  )}
                </td>
                <td className="border border-pink-200 p-4 md:p-5">
                  {editingId === item.id ? (
                    <input
                      type="text"
                      value={editData.whatsapp || item.whatsapp}
                      onChange={(e) => setEditData({...editData, whatsapp: e.target.value})}
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    <span className="text-blue-600 font-mono">{item.whatsapp}</span>
                  )}
                </td>
                {isAdmin && (
                  <td className="border border-pink-200 p-4 md:p-5 text-right">
                    {editingId === item.id ? (
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleSave(item.id)}
                          className="text-green-600 hover:text-green-900"
                          title="Save"
                        >
                          <Save className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="text-gray-500 hover:text-gray-700"
                          title="Cancel"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(item.id)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </td>
                )}
              </tr>
            ))}
            
            {/* Add New Row Form */}
            {isAdmin && isAdding && (
              <tr className="bg-pink-50">
                <td className="border border-pink-200 p-4 md:p-5">
                  <input
                    type="text"
                    value={newRow.name}
                    onChange={(e) => setNewRow({...newRow, name: e.target.value})}
                    placeholder="Name"
                    className="border rounded px-2 py-1 w-full"
                  />
                </td>
                <td className="border border-pink-200 p-4 md:p-5">
                  <input
                    type="text"
                    value={newRow.rate}
                    onChange={(e) => setNewRow({...newRow, rate: e.target.value})}
                    placeholder="Rate"
                    className="border rounded px-2 py-1 w-full"
                  />
                </td>
                <td className="border border-pink-200 p-4 md:p-5">
                  <input
                    type="text"
                    value={newRow.whatsapp}
                    onChange={(e) => setNewRow({...newRow, whatsapp: e.target.value})}
                    placeholder="WhatsApp Number"
                    className="border rounded px-2 py-1 w-full"
                  />
                </td>
                <td className="border border-pink-200 p-4 md:p-5 text-right">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={handleAdd}
                      className="text-green-600 hover:text-green-900"
                      title="Add"
                    >
                      <Save className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setIsAdding(false)}
                      className="text-gray-500 hover:text-gray-700"
                      title="Cancel"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {isAdmin && !isAdding && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New
          </button>
        </div>
      )}
    </div>
  );
}
