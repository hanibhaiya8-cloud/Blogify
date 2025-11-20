'use client';

import { useState, useEffect } from 'react';
import { Edit, Save, X, Plus, Trash2 } from 'lucide-react';
import { extraServiceApi } from '@/services/api';

const STORAGE_KEY = 'extraTablesData';

interface TableData {
  id: string;
  name: string;
  rate: string;
  contact: string;
}

export function ExtraTables() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTable, setActiveTable] = useState(0);
  
  // Load data from localStorage or use initial data
  const loadData = (): TableData[][] => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Failed to parse saved data', e);
        }
      }
    }
    // Default data if nothing in localStorage
    return [
      [
        { id: '1', name: 'Sample 1', rate: '₹5,000', contact: '9876543210' },
        { id: '2', name: 'Sample 2', rate: '₹8,000', contact: '9876543211' },
      ],
      [
        { id: '1', name: 'VIP 1', rate: '₹15,000', contact: '9876543222' },
        { id: '2', name: 'VIP 2', rate: '₹20,000', contact: '9876543223' },
      ]
    ];
  };

  const [tables, setTables] = useState<TableData[][]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<TableData>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [newRow, setNewRow] = useState<Omit<TableData, 'id'>>({ 
    name: '', 
    rate: '', 
    contact: '' 
  });

  // Load data on component mount
  useEffect(() => {
    setTables(loadData());
    // Check admin status
    if (typeof window !== 'undefined') {
      const admin = localStorage.getItem('isAdminAuthenticated') === 'true';
      setIsAdmin(admin);
    }
  }, []);

  // Load data from API by category (standard, vip)
  useEffect(() => {
    const fetchFromApi = async () => {
      try {
        const standard = await extraServiceApi.getAll('standard');
        const vip = await extraServiceApi.getAll('vip');
        const mapList = (arr: any[]): TableData[] => arr.map(i => ({ id: i._id, name: i.name, rate: i.rate, contact: i.contact }));
        const stdList = Array.isArray(standard) ? mapList(standard) : [];
        const vipList = Array.isArray(vip) ? mapList(vip) : [];
        if (stdList.length || vipList.length) {
          setTables([stdList, vipList]);
        }
      } catch (e) {
        console.error('Failed to load extra services', e);
      }
    };
    fetchFromApi();
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (tables.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tables));
    }
  }, [tables]);

  const handleEdit = (tableIndex: number, id: string) => {
    setEditingId(id);
    const itemToEdit = tables[tableIndex].find(item => item.id === id);
    if (itemToEdit) {
      setEditData({ ...itemToEdit });
    }
  };

  const handleSave = async (tableIndex: number, id: string) => {
    try {
      const payload = { name: editData.name, rate: editData.rate, contact: editData.contact };
      const updated = await extraServiceApi.update(id, payload);
      const updatedTables = [...tables];
      updatedTables[tableIndex] = updatedTables[tableIndex].map(item => 
        item.id === id ? { id: updated._id, name: updated.name, rate: updated.rate, contact: updated.contact } : item
      );
      setTables(updatedTables);
      setEditingId(null);
      setEditData({});
    } catch (e) {
      console.error('Failed to save extra service', e);
    }
  };

  const handleAdd = (tableIndex: number) => {
    const create = async () => {
      if (newRow.name && newRow.rate && newRow.contact) {
        try {
          const category = tableIndex === 0 ? 'standard' : 'vip';
          const created = await extraServiceApi.create({ ...newRow, category });
          const updatedTables = [...tables];
          updatedTables[tableIndex] = [...updatedTables[tableIndex], { id: created._id, name: created.name, rate: created.rate, contact: created.contact }];
          setTables(updatedTables);
          setNewRow({ name: '', rate: '', contact: '' });
          setIsAdding(false);
        } catch (e) {
          console.error('Failed to add extra service', e);
        }
      }
    };
    create();
  };

  const handleDelete = (tableIndex: number, id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      const del = async () => {
        try {
          await extraServiceApi.delete(id);
          const updatedTables = [...tables];
          updatedTables[tableIndex] = updatedTables[tableIndex].filter(item => item.id !== id);
          setTables(updatedTables);
        } catch (e) {
          console.error('Failed to delete extra service', e);
        }
      };
      del();
    }
  };

  const tableTitles = ['Standard Services', 'VIP Services'];

  return (
    <div className="space-y-12">
      {tables.map((table, tableIndex) => (
        <div key={tableIndex} className="bg-white rounded-xl shadow-md overflow-hidden mb-12">
          <h3 className="text-xl font-bold p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            {tableTitles[tableIndex] || `Table ${tableIndex + 1}`}
          </h3>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  {isAdmin && (
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {table.map((item) => (
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
                        <input
                          type="text"
                          value={editData.rate || ''}
                          onChange={(e) => setEditData({...editData, rate: e.target.value})}
                          className="border rounded px-2 py-1 w-full"
                        />
                      ) : (
                        item.rate
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingId === item.id ? (
                        <input
                          type="text"
                          value={editData.contact || ''}
                          onChange={(e) => setEditData({...editData, contact: e.target.value})}
                          className="border rounded px-2 py-1 w-full"
                        />
                      ) : (
                        item.contact
                      )}
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {editingId === item.id ? (
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleSave(tableIndex, item.id)}
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
                              onClick={() => handleEdit(tableIndex, item.id)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Edit"
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(tableIndex, item.id)}
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
                {isAdding && activeTable === tableIndex && (
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
                      <input
                        type="text"
                        value={newRow.rate}
                        onChange={(e) => setNewRow({...newRow, rate: e.target.value})}
                        placeholder="Rate"
                        className="border rounded px-2 py-1 w-full"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="text"
                        value={newRow.contact}
                        onChange={(e) => setNewRow({...newRow, contact: e.target.value})}
                        placeholder="Contact"
                        className="border rounded px-2 py-1 w-full"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleAdd(tableIndex)}
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
                onClick={() => {
                  setActiveTable(tableIndex);
                  setIsAdding(true);
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
