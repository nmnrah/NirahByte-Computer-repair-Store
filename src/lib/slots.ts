import { addMinutes, format, isAfter, isBefore, isSameDay, parse, parseISO, startOfDay, addHours } from 'date-fns';
import { Appointment, BlockedDate, BusinessHours, ClinicSettings, Service, AvailableSlot } from '../types';

export function generateAvailableSlots(
  targetDate: Date,
  service: Service,
  businessHours: BusinessHours[],
  blockedDates: BlockedDate[],
  clinicSettings: ClinicSettings,
  appointments: Appointment[]
): AvailableSlot[] {
  const slots: AvailableSlot[] = [];
  const targetDateString = format(targetDate, 'yyyy-MM-dd');

  // Check if date is blocked
  const isBlocked = blockedDates.some(bd => bd.blocked_date === targetDateString);
  if (isBlocked) return slots;

  // Check if clinic is open on this weekday
  const weekday = targetDate.getDay();
  const dayHours = businessHours.find(bh => bh.weekday === weekday);
  
  if (!dayHours || !dayHours.is_open || !dayHours.start_time || !dayHours.end_time) {
    return slots;
  }

  // Define start and end boundaries for the day
  const dayStart = parse(dayHours.start_time, 'HH:mm:ss', targetDate);
  const dayEnd = parse(dayHours.end_time, 'HH:mm:ss', targetDate);
  
  // Notice time constraint
  const now = new Date();
  const minimumBookingTime = addHours(now, clinicSettings.booking_notice_hours || 0);

  // Filter appointments for the target date that are not cancelled
  const dayAppointments = appointments.filter(
    apt => apt.appointment_date === targetDateString && apt.status !== 'cancelled'
  );

  let currentSlotStart = dayStart;
  const serviceDuration = service.duration_minutes || 60;
  const slotInterval = clinicSettings.slot_interval_minutes || 30;

  while (isBefore(currentSlotStart, dayEnd)) {
    const currentSlotEnd = addMinutes(currentSlotStart, serviceDuration);

    // If slot ends after business hours, break
    if (isAfter(currentSlotEnd, dayEnd)) {
      break;
    }

    // Skip if slot is before the minimum booking notice time
    if (isBefore(currentSlotStart, minimumBookingTime)) {
      currentSlotStart = addMinutes(currentSlotStart, slotInterval);
      continue;
    }

    // Check for overlap with existing appointments
    // Overlap rule: new_start < existing_end AND new_end > existing_start
    const hasOverlap = dayAppointments.some(apt => {
      const aptStart = parse(apt.start_time, 'HH:mm:ss', targetDate);
      const aptEnd = parse(apt.end_time, 'HH:mm:ss', targetDate);
      
      return isBefore(currentSlotStart, aptEnd) && isAfter(currentSlotEnd, aptStart);
    });

    if (!hasOverlap) {
      slots.push({
        start: currentSlotStart,
        end: currentSlotEnd,
        label: format(currentSlotStart, 'h:mm a')
      });
    }

    // Move to next slot start
    currentSlotStart = addMinutes(currentSlotStart, slotInterval);
  }

  return slots;
}
