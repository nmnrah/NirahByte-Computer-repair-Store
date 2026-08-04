import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { BlockedDate } from '../../types';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

export default function BlockedDates() {
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newReason, setNewReason] = useState('');

  useEffect(() => {
    fetchBlockedDates();
  }, []);

  const fetchBlockedDates = async () => {
    setIsLoading(true);
    const { data } = await supabase.from('blocked_dates').select('*').order('blocked_date');
    if (data) setBlockedDates(data as BlockedDate[]);
    setIsLoading(false);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await supabase.from('blocked_dates').insert([{
      blocked_date: newDate,
      reason: newReason || null
    }]);
    setIsAdding(false);
    setNewDate('');
    setNewReason('');
    fetchBlockedDates();
  };

  const handleDelete = async (id: string) => {
    await supabase.from('blocked_dates').delete().eq('id', id);
    fetchBlockedDates();
  };

  if (isLoading && !isAdding) {
    return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-[#2C5254]" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900">Blocked Dates</h2>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-[#2C5254] hover:bg-[#1E3B3D] text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Blocked Date
        </button>
      </div>

      {isAdding && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h3 className="text-base font-medium mb-4 text-gray-900">New Blocked Date</h3>
          <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                required
                value={newDate}
                onChange={e => setNewDate(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#2C5254] focus:border-[#2C5254] sm:text-sm"
              />
            </div>
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">Reason (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Public Holiday"
                value={newReason}
                onChange={e => setNewReason(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#2C5254] focus:border-[#2C5254] sm:text-sm"
              />
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 flex-1 sm:flex-none"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#2C5254] hover:bg-[#1E3B3D] flex-1 sm:flex-none"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {blockedDates.map((date) => (
              <tr key={date.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {format(new Date(`${date.blocked_date}T00:00:00`), 'MMMM d, yyyy')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {date.reason || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleDelete(date.id)}
                    className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {blockedDates.length === 0 && (
          <div className="text-center py-12 text-sm text-gray-500">
            No blocked dates configured.
          </div>
        )}
      </div>
    </div>
  );
}
