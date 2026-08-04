import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Service, ClinicSettings, BusinessHours, BlockedDate, Appointment, AvailableSlot } from '../../types';
import { generateAvailableSlots } from '../../lib/slots';
import { format, addDays, startOfToday, isSameDay } from 'date-fns';
import { Loader2, ChevronRight, CheckCircle2, MonitorSmartphone, Calendar as CalendarIcon, User, Clock, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Booking() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  
  // Data state
  const [services, setServices] = useState<Service[]>([]);
  const [settings, setSettings] = useState<ClinicSettings | null>(null);
  const [businessHours, setBusinessHours] = useState<BusinessHours[]>([]);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  
  // Selection state
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(startOfToday());
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setIsLoading(true);
    const [servicesRes, settingsRes, hoursRes, blockedRes] = await Promise.all([
      supabase.from('services').select('*').eq('is_active', true).order('name'),
      supabase.from('clinic_settings').select('*').limit(1).single(),
      supabase.from('business_hours').select('*'),
      supabase.from('blocked_dates').select('*')
    ]);

    if (servicesRes.data) setServices(servicesRes.data as Service[]);
    if (settingsRes.data) setSettings(settingsRes.data as ClinicSettings);
    if (hoursRes.data) setBusinessHours(hoursRes.data as BusinessHours[]);
    if (blockedRes.data) setBlockedDates(blockedRes.data as BlockedDate[]);
    
    setIsLoading(false);
  };

  const fetchAppointmentsForDate = async (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const { data } = await supabase
      .from('appointments')
      .select('*')
      .eq('appointment_date', dateStr)
      .neq('status', 'cancelled');
    
    if (data) {
      setAppointments(data as Appointment[]);
      updateAvailableSlots(date, data as Appointment[]);
    }
  };

  const updateAvailableSlots = (date: Date, apts: Appointment[]) => {
    if (!selectedService || !settings) return;
    
    const slots = generateAvailableSlots(
      date,
      selectedService,
      businessHours,
      blockedDates,
      settings,
      apts
    );
    setAvailableSlots(slots);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    fetchAppointmentsForDate(date);
  };

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setStep(2);
    // Fetch slots for default date
    fetchAppointmentsForDate(selectedDate);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !selectedSlot) return;

    setIsSubmitting(true);
    const { error } = await supabase.from('appointments').insert([{
      full_name: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      service_id: selectedService.id,
      appointment_date: format(selectedSlot.start, 'yyyy-MM-dd'),
      start_time: format(selectedSlot.start, 'HH:mm:00'),
      end_time: format(selectedSlot.end, 'HH:mm:00'),
      notes: formData.notes || null,
      status: 'pending'
    }]);

    setIsSubmitting(false);
    if (!error) {
      setStep(4);
    }
  };

  // Generate next 14 days for date picker
  const dates = Array.from({ length: 14 }).map((_, i) => addDays(startOfToday(), i));

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-[#F9F9F9]">
        <Loader2 className="w-8 h-8 animate-spin text-[#2C5254]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9F9] py-12 px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Step Indicator */}
        {step < 4 && (
          <div className="mb-8">
            <div className="flex items-center justify-between relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-gray-200 -z-10"></div>
              <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-[#2C5254] transition-all duration-500 -z-10" style={{ width: `${((step - 1) / 2) * 100}%` }}></div>
              
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex flex-col items-center gap-2 bg-[#F9F9F9] px-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-colors border-2
                    ${step > s ? 'bg-[#2C5254] text-white border-[#2C5254]' : 
                      step === s ? 'bg-white text-[#2C5254] border-[#2C5254]' : 
                      'bg-white text-gray-400 border-gray-200'}`}>
                    {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
                  </div>
                  <span className={`text-xs font-medium ${step >= s ? 'text-gray-900' : 'text-gray-400'}`}>
                    {s === 1 ? 'Service' : s === 2 ? 'Date & Time' : 'Details'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/40 border border-gray-100 overflow-hidden">
          
          {/* Step 1: Services */}
          {step === 1 && (
            <div className="p-8 md:p-12">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Select a Service</h2>
                <p className="text-gray-500 mt-2">Choose the repair service that best fits your needs.</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {services.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => handleServiceSelect(service)}
                    className="text-left p-6 border-2 border-gray-100 hover:border-[#2C5254] rounded-xl transition-all hover:shadow-md group flex flex-col h-full"
                  >
                    <MonitorSmartphone className="w-8 h-8 text-[#2C5254] mb-4" />
                    <h3 className="font-semibold text-gray-900 text-lg mb-2">{service.name}</h3>
                    <p className="text-gray-500 text-sm mb-6 flex-1">{service.description}</p>
                    <div className="flex items-center justify-between w-full pt-4 border-t border-gray-50">
                      <span className="font-semibold text-[#2C5254]">${service.price.toFixed(2)}</span>
                      <span className="text-gray-400 text-sm">{service.duration_minutes} min</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Date & Time */}
          {step === 2 && (
            <div className="p-8 md:p-12">
              <button 
                onClick={() => setStep(1)}
                className="mb-8 text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Services
              </button>
              
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Select Date & Time</h2>
                <p className="text-gray-500 mt-2">When would you like to bring your device in?</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-gray-500" />
                    Available Dates
                  </h3>
                  <div className="grid grid-cols-4 gap-2">
                    {dates.map((date) => {
                      const isSelected = isSameDay(date, selectedDate);
                      const isBlocked = blockedDates.some(bd => bd.blocked_date === format(date, 'yyyy-MM-dd'));
                      const dayWeekday = date.getDay();
                      const isOpen = businessHours.find(bh => bh.weekday === dayWeekday)?.is_open;
                      const isDisabled = isBlocked || !isOpen;

                      return (
                        <button
                          key={date.toISOString()}
                          disabled={isDisabled}
                          onClick={() => handleDateSelect(date)}
                          className={`p-3 flex flex-col items-center justify-center rounded-lg border-2 transition-all
                            ${isDisabled ? 'opacity-30 cursor-not-allowed bg-gray-50 border-gray-100' :
                              isSelected ? 'border-[#2C5254] bg-[#2C5254]/5' : 'border-gray-100 hover:border-gray-300'
                            }`}
                        >
                          <span className={`text-xs font-medium mb-1 ${isSelected ? 'text-[#2C5254]' : 'text-gray-500'}`}>
                            {format(date, 'EEE')}
                          </span>
                          <span className={`text-lg font-semibold ${isSelected ? 'text-[#2C5254]' : 'text-gray-900'}`}>
                            {format(date, 'd')}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    Available Times
                  </h3>
                  {availableSlots.length === 0 ? (
                    <div className="bg-gray-50 border border-gray-100 rounded-lg p-6 text-center text-sm text-gray-500">
                      No available slots for this date.
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {availableSlots.map((slot, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedSlot(slot)}
                          className={`py-2 px-3 rounded-lg border text-sm font-medium transition-all
                            ${selectedSlot === slot 
                              ? 'bg-[#2C5254] text-white border-[#2C5254]' 
                              : 'bg-white border-gray-200 text-gray-700 hover:border-[#2C5254] hover:text-[#2C5254]'
                            }`}
                        >
                          {slot.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-12 flex justify-end pt-6 border-t border-gray-100">
                <button
                  disabled={!selectedSlot}
                  onClick={() => setStep(3)}
                  className="bg-[#2C5254] hover:bg-[#1E3B3D] text-white px-8 py-3 rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  Continue <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Details */}
          {step === 3 && (
            <div className="p-8 md:p-12">
              <button 
                onClick={() => setStep(2)}
                className="mb-8 text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Time Selection
              </button>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2">
                  <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-8">Your Details</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                          type="text"
                          required
                          value={formData.fullName}
                          onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                          className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-[#2C5254] focus:border-[#2C5254]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={e => setFormData({ ...formData, email: e.target.value })}
                          className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-[#2C5254] focus:border-[#2C5254]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={e => setFormData({ ...formData, phone: e.target.value })}
                          className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-[#2C5254] focus:border-[#2C5254]"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Device Issues & Notes</label>
                        <textarea
                          rows={3}
                          value={formData.notes}
                          onChange={e => setFormData({ ...formData, notes: e.target.value })}
                          placeholder="Describe the issue with your device..."
                          className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-[#2C5254] focus:border-[#2C5254]"
                        />
                      </div>
                    </div>

                    <div className="pt-6">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[#2C5254] hover:bg-[#1E3B3D] text-white px-8 py-4 rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-[#2C5254]/20"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" /> Processing...
                          </>
                        ) : (
                          'Confirm Booking'
                        )}
                      </button>
                    </div>
                  </form>
                </div>
                
                {/* Summary Sidebar */}
                <div className="bg-gray-50 rounded-2xl p-6 h-fit border border-gray-100">
                  <h3 className="font-semibold text-gray-900 mb-4 pb-4 border-b border-gray-200">Booking Summary</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Service</p>
                      <p className="text-gray-900 font-medium">{selectedService?.name}</p>
                      <p className="text-gray-500 text-sm mt-1">{selectedService?.duration_minutes} minutes</p>
                    </div>
                    
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Date & Time</p>
                      <p className="text-gray-900 font-medium">{format(selectedDate, 'EEEE, MMMM do, yyyy')}</p>
                      <p className="text-gray-500 text-sm mt-1">{selectedSlot?.label}</p>
                    </div>

                    <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                      <p className="text-sm font-medium text-gray-500">Estimated Total</p>
                      <p className="text-lg font-bold text-[#2C5254]">${selectedService?.price.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
            <div className="p-12 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-4">Booking Confirmed</h2>
              <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                Thank you, {formData.fullName.split(' ')[0]}. We've sent a confirmation email with your appointment details.
              </p>
              
              <div className="bg-gray-50 rounded-2xl p-6 max-w-sm mx-auto mb-10 border border-gray-100 text-left space-y-4">
                <div className="flex items-start gap-3">
                  <CalendarIcon className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">{format(selectedDate, 'MMMM do, yyyy')}</p>
                    <p className="text-gray-500 text-sm">{selectedSlot?.label}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MonitorSmartphone className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">{selectedService?.name}</p>
                    <p className="text-gray-500 text-sm">${selectedService?.price.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <Link
                to="/"
                className="inline-flex justify-center py-3 px-8 border border-gray-200 rounded-xl shadow-sm text-sm font-medium text-gray-900 bg-white hover:bg-gray-50 transition-colors"
              >
                Return to Homepage
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
