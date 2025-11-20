'use client';

import { useState, useEffect } from 'react';
import { Edit, Save, X, Plus, Trash2 } from 'lucide-react';
import { isAdminAuthenticated } from '../lib/auth';
import { serviceApi } from '@/services/api';

interface TableData {
  id: string;
  name: string;
  service: string;
  duration: string;
  price: number;
}

export function EditableTable() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [data, setData] = useState<TableData[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<TableData>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [newRow, setNewRow] = useState<Omit<TableData, 'id'>>({ 
    name: '', 
    service: 'Premium', 
    duration: '1 Hour', 
    price: 0 
  });

  useEffect(() => {
    // Check if user is admin when component mounts
    setIsAdmin(isAdminAuthenticated());
  }, []);

  // Load data from API on component mount
  useEffect(() => {
    const load = async () => {
      try {
        const items = await serviceApi.getAll();
        const mapped: TableData[] = items.map((i: any) => ({
          id: i._id,
          name: i.name,
          service: i.service,
          duration: i.duration,
          price: i.price,
        }));
        setData(mapped);
      } catch (e) {
        console.error('Failed to load services', e);
      }
    };
    load();
  }, []);

  const handleEdit = (id: string) => {
    setEditingId(id);
    const itemToEdit = data.find(item => item.id === id);
    if (itemToEdit) {
      setEditData({ ...itemToEdit });
    }
  };

  const handleSave = async (id: string) => {
    try {
      const updated = await serviceApi.update(id, {
        name: editData.name,
        service: editData.service,
        duration: editData.duration,
        price: editData.price,
      });
      setData(data.map(item => item.id === id ? {
        id: updated._id,
        name: updated.name,
        service: updated.service,
        duration: updated.duration,
        price: updated.price,
      } : item));
      setEditingId(null);
      setEditData({});
    } catch (e) {
      console.error('Failed to save service', e);
    }
  };

  const handleAdd = () => {
    const create = async () => {
      if (newRow.name && newRow.price > 0) {
        try {
          const created = await serviceApi.create(newRow);
          setData([...data, {
            id: created._id,
            name: created.name,
            service: created.service,
            duration: created.duration,
            price: created.price,
          }]);
          setNewRow({ name: '', service: 'Premium', duration: '1 Hour', price: 0 });
          setIsAdding(false);
        } catch (e) {
          console.error('Failed to add service', e);
        }
      }
    };
    create();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      const del = async () => {
        try {
          await serviceApi.delete(id);
          setData(data.filter(item => item.id !== id));
        } catch (e) {
          console.error('Failed to delete service', e);
        }
      };
      del();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-purple-600 to-pink-600">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Service</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Duration</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Price (₹)</th>
              {isAdmin && (
                <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingId === item.id ? (
                    <input
                      type="text"
                      value={editData.name || ''}
                      onChange={(e) => setEditData({...editData, name: e.target.value})}
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    item.name
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingId === item.id ? (
                    <select
                      value={editData.service || ''}
                      onChange={(e) => setEditData({...editData, service: e.target.value})}
                      className="border rounded px-2 py-1 w-full"
                    >
                      <option value="Premium">Premium</option>
                      <option value="Standard">Standard</option>
                      <option value="VIP">VIP</option>
                    </select>
                  ) : (
                    item.service
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingId === item.id ? (
                    <select
                      value={editData.duration || ''}
                      onChange={(e) => setEditData({...editData, duration: e.target.value})}
                      className="border rounded px-2 py-1 w-full"
                    >
                      <option value="1 Hour">1 Hour</option>
                      <option value="2 Hours">2 Hours</option>
                      <option value="Full Night">Full Night</option>
                    </select>
                  ) : (
                    item.duration
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingId === item.id ? (
                    <input
                      type="number"
                      value={editData.price || ''}
                      onChange={(e) => setEditData({...editData, price: Number(e.target.value)})}
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    `₹${item.price.toLocaleString()}`
                  )}
                </td>
                {isAdmin && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
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
            {isAdding && (
              <tr className="bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="text"
                    value={newRow.name}
                    onChange={(e) => setNewRow({...newRow, name: e.target.value})}
                    placeholder="Name"
                    className="border rounded px-2 py-1 w-full"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={newRow.service}
                    onChange={(e) => setNewRow({...newRow, service: e.target.value})}
                    className="border rounded px-2 py-1 w-full"
                  >
                    <option value="Premium">Premium</option>
                    <option value="Standard">Standard</option>
                    <option value="VIP">VIP</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={newRow.duration}
                    onChange={(e) => setNewRow({...newRow, duration: e.target.value})}
                    className="border rounded px-2 py-1 w-full"
                  >
                    <option value="1 Hour">1 Hour</option>
                    <option value="2 Hours">2 Hours</option>
                    <option value="Full Night">Full Night</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="number"
                    value={newRow.price || ''}
                    onChange={(e) => setNewRow({...newRow, price: Number(e.target.value)})}
                    placeholder="Price"
                    className="border rounded px-2 py-1 w-full"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
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
      
      {isAdmin && (
        <div className="bg-gray-50 px-6 py-3 flex justify-end">
          <button
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New
          </button>
        </div>
      )}
    </div>
  );
}
