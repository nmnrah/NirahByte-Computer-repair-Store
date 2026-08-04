import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Service } from '../../types';
import { Plus, Edit2, Loader2, Trash2 } from 'lucide-react';

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentService, setCurrentService] = useState<Partial<Service>>({});

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setIsLoading(true);
    const { data } = await supabase.from('services').select('*').order('name');
    if (data) setServices(data as Service[]);
    setIsLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentService.id) {
      await supabase.from('services').update(currentService).eq('id', currentService.id);
    } else {
      await supabase.from('services').insert([currentService]);
    }
    setIsEditing(false);
    setCurrentService({});
    fetchServices();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      await supabase.from('services').delete().eq('id', id);
      fetchServices();
    }
  };

  if (isLoading && !isEditing) {
    return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-[#2C5254]" /></div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900">Services Management</h2>
        <button
          onClick={() => { setCurrentService({ is_active: true }); setIsEditing(true); }}
          className="bg-[#2C5254] hover:bg-[#1E3B3D] text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Service
        </button>
      </div>

      {isEditing ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-medium mb-4">{currentService.id ? 'Edit Service' : 'New Service'}</h3>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  required
                  value={currentService.name || ''}
                  onChange={e => setCurrentService({ ...currentService, name: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#2C5254] focus:border-[#2C5254] sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Price ($)</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={currentService.price || ''}
                  onChange={e => setCurrentService({ ...currentService, price: parseFloat(e.target.value) })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#2C5254] focus:border-[#2C5254] sm:text-sm"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  required
                  rows={3}
                  value={currentService.description || ''}
                  onChange={e => setCurrentService({ ...currentService, description: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#2C5254] focus:border-[#2C5254] sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Duration (Minutes)</label>
                <input
                  type="number"
                  required
                  min="15"
                  step="15"
                  value={currentService.duration_minutes || ''}
                  onChange={e => setCurrentService({ ...currentService, duration_minutes: parseInt(e.target.value) })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#2C5254] focus:border-[#2C5254] sm:text-sm"
                />
              </div>
              <div className="flex items-center mt-6">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={currentService.is_active || false}
                  onChange={e => setCurrentService({ ...currentService, is_active: e.target.checked })}
                  className="h-4 w-4 text-[#2C5254] focus:ring-[#2C5254] border-gray-300 rounded"
                />
                <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                  Active (Visible on booking page)
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2C5254]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#2C5254] hover:bg-[#1E3B3D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2C5254]"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {services.map((service) => (
                <tr key={service.id}>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{service.name}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">{service.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {service.duration_minutes} min
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    ${service.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      service.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {service.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => { setCurrentService(service); setIsEditing(true); }}
                      className="text-[#2C5254] hover:text-[#1E3B3D] mr-4"
                    >
                      <Edit2 className="w-4 h-4 inline" />
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-4 h-4 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {services.length === 0 && (
            <div className="text-center py-12 text-sm text-gray-500">
              No services configured yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
