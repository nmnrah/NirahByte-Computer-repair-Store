import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { ClinicSettings } from '../../types';
import { Loader2, Save } from 'lucide-react';

export default function Settings() {
  const [settings, setSettings] = useState<Partial<ClinicSettings>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    const { data } = await supabase.from('clinic_settings').select('*').limit(1).single();
    if (data) {
      setSettings(data);
    } else {
      // Default settings if none exist
      setSettings({
        clinic_name: 'TechRepair',
        clinic_email: 'hello@techrepair.com',
        clinic_phone: '(555) 123-4567',
        clinic_address: '123 Tech Lane, Silicon Valley',
        slot_interval_minutes: 30,
        booking_notice_hours: 24
      });
    }
    setIsLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    if (settings.id) {
      await supabase.from('clinic_settings').update(settings).eq('id', settings.id);
    } else {
      await supabase.from('clinic_settings').insert([settings]);
      // Refetch to get the ID
      fetchSettings();
    }
    
    setIsSaving(false);
  };

  if (isLoading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-[#2C5254]" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900">Store Settings</h2>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <form onSubmit={handleSave} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-base font-medium text-gray-900 border-b border-gray-100 pb-2">General Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Store Name</label>
                <input
                  type="text"
                  required
                  value={settings.clinic_name || ''}
                  onChange={e => setSettings({ ...settings, clinic_name: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#2C5254] focus:border-[#2C5254] sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Contact Email</label>
                <input
                  type="email"
                  required
                  value={settings.clinic_email || ''}
                  onChange={e => setSettings({ ...settings, clinic_email: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#2C5254] focus:border-[#2C5254] sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="text"
                  required
                  value={settings.clinic_phone || ''}
                  onChange={e => setSettings({ ...settings, clinic_phone: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#2C5254] focus:border-[#2C5254] sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <textarea
                  required
                  rows={3}
                  value={settings.clinic_address || ''}
                  onChange={e => setSettings({ ...settings, clinic_address: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#2C5254] focus:border-[#2C5254] sm:text-sm"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-base font-medium text-gray-900 border-b border-gray-100 pb-2">Booking Rules</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Slot Interval (Minutes)</label>
                <p className="text-xs text-gray-500 mb-1">How often slots can start (e.g., every 30 mins)</p>
                <input
                  type="number"
                  required
                  min="15"
                  step="15"
                  value={settings.slot_interval_minutes || ''}
                  onChange={e => setSettings({ ...settings, slot_interval_minutes: parseInt(e.target.value) })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#2C5254] focus:border-[#2C5254] sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Booking Notice (Hours)</label>
                <p className="text-xs text-gray-500 mb-1">Minimum hours before an appointment can be booked</p>
                <input
                  type="number"
                  required
                  min="0"
                  value={settings.booking_notice_hours || ''}
                  onChange={e => setSettings({ ...settings, booking_notice_hours: parseInt(e.target.value) })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#2C5254] focus:border-[#2C5254] sm:text-sm"
                />
              </div>
            </div>
          </div>
          
          <div className="pt-5 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#2C5254] hover:bg-[#1E3B3D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2C5254] disabled:opacity-50 transition-colors"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
