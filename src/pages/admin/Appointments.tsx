import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Appointment } from '../../types';
import { format } from 'date-fns';
import { Loader2, Search } from 'lucide-react';

export default function Appointments() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, [statusFilter]);

  const fetchAppointments = async () => {
    setIsLoading(true);
    let query = supabase
      .from('appointments')
      .select('*, services(name)')
      .order('appointment_date', { ascending: false })
      .order('start_time', { ascending: true });
      
    if (statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }
    
    const { data } = await query;
    if (data) setAppointments(data);
    setIsLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('appointments').update({ status }).eq('id', id);
    fetchAppointments();
  };

  const filteredAppointments = appointments.filter(apt => 
    apt.full_name.toLowerCase().includes(search.toLowerCase()) || 
    apt.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-lg font-medium text-gray-900">Appointments</h2>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search customers..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#2C5254] focus:border-[#2C5254] sm:text-sm w-full"
            />
          </div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#2C5254] focus:border-[#2C5254] sm:text-sm"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-[#2C5254]" /></div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAppointments.map((apt) => (
                <tr key={apt.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{apt.full_name}</div>
                    <div className="text-sm text-gray-500">{apt.email}</div>
                    <div className="text-xs text-gray-400 mt-1">{apt.phone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{apt.services?.name}</div>
                    {apt.notes && (
                      <div className="text-xs text-gray-500 mt-1 truncate max-w-[200px]" title={apt.notes}>
                        Note: {apt.notes}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {format(new Date(`${apt.appointment_date}T00:00:00`), 'MMM d, yyyy')}
                    </div>
                    <div className="text-sm text-gray-500">
                      {apt.start_time.substring(0, 5)} - {apt.end_time.substring(0, 5)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize
                      ${apt.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                        apt.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                        apt.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                        'bg-yellow-100 text-yellow-800'}`}>
                      {apt.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <select
                      value={apt.status}
                      onChange={(e) => updateStatus(apt.id, e.target.value)}
                      className="px-2 py-1 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-[#2C5254] focus:border-[#2C5254] bg-white"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirm</option>
                      <option value="completed">Complete</option>
                      <option value="cancelled">Cancel</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredAppointments.length === 0 && (
            <div className="text-center py-12 text-sm text-gray-500">
              No appointments found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
