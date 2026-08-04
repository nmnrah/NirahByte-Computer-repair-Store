import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Appointment } from '../../types';
import { format } from 'date-fns';
import { Users, Calendar as CalendarIcon, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [stats, setStats] = useState({
    upcomingAppointments: 0,
    totalServices: 0,
    todayAppointments: 0
  });
  const [recentAppointments, setRecentAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const today = format(new Date(), 'yyyy-MM-dd');
      
      const [appointmentsRes, servicesRes, todayRes, recentRes] = await Promise.all([
        supabase.from('appointments').select('id', { count: 'exact' }).gte('appointment_date', today).neq('status', 'cancelled'),
        supabase.from('services').select('id', { count: 'exact' }).eq('is_active', true),
        supabase.from('appointments').select('id', { count: 'exact' }).eq('appointment_date', today).neq('status', 'cancelled'),
        supabase.from('appointments')
          .select('*, services(name)')
          .order('created_at', { ascending: false })
          .limit(5)
      ]);

      setStats({
        upcomingAppointments: appointmentsRes.count || 0,
        totalServices: servicesRes.count || 0,
        todayAppointments: todayRes.count || 0
      });
      
      if (recentRes.data) {
        setRecentAppointments(recentRes.data as any);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Stat Cards */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 truncate">Appointments Today</p>
              <p className="mt-2 text-3xl font-semibold text-gray-900">{stats.todayAppointments}</p>
            </div>
            <div className="bg-[#2C5254]/10 p-3 rounded-lg">
              <CalendarIcon className="w-6 h-6 text-[#2C5254]" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 truncate">Upcoming Appointments</p>
              <p className="mt-2 text-3xl font-semibold text-gray-900">{stats.upcomingAppointments}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 truncate">Active Services</p>
              <p className="mt-2 text-3xl font-semibold text-gray-900">{stats.totalServices}</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Appointments */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-base font-semibold leading-6 text-gray-900">Recent Bookings</h3>
          <Link to="/admin/appointments" className="text-sm font-medium text-[#2C5254] hover:text-[#1E3B3D] flex items-center gap-1">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="divide-y divide-gray-100">
          {recentAppointments.length === 0 ? (
            <div className="px-6 py-8 text-center text-sm text-gray-500">
              No recent bookings found.
            </div>
          ) : (
            recentAppointments.map((apt: any) => (
              <div key={apt.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div>
                  <p className="text-sm font-medium text-gray-900">{apt.full_name}</p>
                  <p className="text-sm text-gray-500">{apt.services?.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-900 font-medium">
                    {format(new Date(`${apt.appointment_date}T00:00:00`), 'MMM d, yyyy')}
                  </p>
                  <p className="text-sm text-gray-500">{apt.start_time.substring(0, 5)} - {apt.end_time.substring(0, 5)}</p>
                </div>
                <div>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize
                    ${apt.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                      apt.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                      apt.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                      'bg-yellow-100 text-yellow-800'}`}>
                    {apt.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
