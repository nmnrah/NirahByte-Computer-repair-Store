import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { BusinessHours } from '../../types';
import { Loader2, Save } from 'lucide-react';

const WEEKDAYS = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

export default function BusinessHoursManager() {
  const [hours, setHours] = useState<BusinessHours[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchHours();
  }, []);

  const fetchHours = async () => {
    setIsLoading(true);
    const { data } = await supabase.from('business_hours').select('*').order('weekday');
    
    if (data && data.length > 0) {
      setHours(data as BusinessHours[]);
    } else {
      // Initialize if empty
      const initial: Omit<BusinessHours, 'id'>[] = WEEKDAYS.map((_, index) => ({
        weekday: index,
        is_open: index !== 0 && index !== 6, // Closed weekends by default
        start_time: index !== 0 && index !== 6 ? '09:00:00' : null,
        end_time: index !== 0 && index !== 6 ? '17:00:00' : null,
      }));
      setHours(initial as any);
    }
    setIsLoading(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    // Clear out existing
    await supabase.from('business_hours').delete().neq('weekday', -1); // delete all
    
    // Insert new
    const { error } = await supabase.from('business_hours').insert(
      hours.map(h => ({
        weekday: h.weekday,
        is_open: h.is_open,
        start_time: h.is_open ? h.start_time : null,
        end_time: h.is_open ? h.end_time : null
      }))
    );
    
    if (!error) {
      fetchHours();
    }
    setIsSaving(false);
  };

  const updateHour = (weekday: number, field: keyof BusinessHours, value: any) => {
    setHours(prev => prev.map(h => {
      if (h.weekday === weekday) {
        return { ...h, [field]: value };
      }
      return h;
    }));
  };

  if (isLoading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-[#2C5254]" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900">Business Hours</h2>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-[#2C5254] hover:bg-[#1E3B3D] text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-sm disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="divide-y divide-gray-100">
          {WEEKDAYS.map((day, index) => {
            const hour = hours.find(h => h.weekday === index) || { weekday: index, is_open: false, start_time: '09:00:00', end_time: '17:00:00' } as BusinessHours;
            
            return (
              <div key={day} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4 w-48">
                  <input
                    type="checkbox"
                    id={`day-${index}`}
                    checked={hour.is_open}
                    onChange={e => updateHour(index, 'is_open', e.target.checked)}
                    className="h-4 w-4 text-[#2C5254] focus:ring-[#2C5254] border-gray-300 rounded"
                  />
                  <label htmlFor={`day-${index}`} className="font-medium text-gray-900 select-none">
                    {day}
                  </label>
                </div>
                
                <div className="flex items-center gap-4 flex-1 justify-end">
                  {hour.is_open ? (
                    <>
                      <input
                        type="time"
                        value={hour.start_time?.substring(0, 5) || '09:00'}
                        onChange={e => updateHour(index, 'start_time', e.target.value + ':00')}
                        className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#2C5254] focus:border-[#2C5254] sm:text-sm"
                      />
                      <span className="text-gray-500">to</span>
                      <input
                        type="time"
                        value={hour.end_time?.substring(0, 5) || '17:00'}
                        onChange={e => updateHour(index, 'end_time', e.target.value + ':00')}
                        className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#2C5254] focus:border-[#2C5254] sm:text-sm"
                      />
                    </>
                  ) : (
                    <span className="text-gray-400 text-sm italic px-3 py-2">Closed</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
