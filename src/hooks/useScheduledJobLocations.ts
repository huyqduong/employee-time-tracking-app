import { useState, useEffect } from 'react';
import { ScheduledJobLocation } from '../types';
import { format, isWithinInterval, parseISO, startOfDay, endOfDay } from 'date-fns';

export const useScheduledJobLocations = () => {
  const [scheduledLocations, setScheduledLocations] = useState<ScheduledJobLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchScheduledLocations();
  }, []);

  const fetchScheduledLocations = async () => {
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      const mockData: ScheduledJobLocation[] = [
        {
          id: '1',
          jobLocationId: '1',
          jobLocation: {
            id: '1',
            name: 'Downtown Office',
            address: '123 Main St',
            city: 'San Francisco',
            state: 'CA',
            zip: '94105',
            isActive: true,
            requiredEmployeeTypes: [
              {
                employeeTypeId: '1',
                minEmployees: 2,
                preferredEmployees: 3,
              },
            ],
            operatingHours: {
              monday: { open: '09:00', close: '17:00' },
              tuesday: { open: '09:00', close: '17:00' },
              wednesday: { open: '09:00', close: '17:00' },
              thursday: { open: '09:00', close: '17:00' },
              friday: { open: '09:00', close: '17:00' },
              saturday: { open: '', close: '' },
              sunday: { open: '', close: '' },
            },
          },
          startDate: '2024-12-22',
          endDate: '2024-12-22',
          startTime: '09:00',
          endTime: '17:00',
          status: 'scheduled',
          notes: 'Regular cleaning schedule',
        },
        // Add more mock data as needed
      ];
      setScheduledLocations(mockData);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch scheduled locations');
      setLoading(false);
    }
  };

  const getTodaySchedule = () => {
    const today = new Date();
    return scheduledLocations.filter(schedule => {
      const scheduleDate = parseISO(schedule.startDate);
      return isWithinInterval(today, {
        start: startOfDay(scheduleDate),
        end: endOfDay(scheduleDate)
      });
    });
  };

  const getUpcomingSchedule = () => {
    const today = new Date();
    return scheduledLocations.filter(schedule => {
      const scheduleDate = parseISO(schedule.startDate);
      return scheduleDate > today;
    });
  };

  const updateScheduleStatus = async (
    scheduleId: string,
    status: ScheduledJobLocation['status']
  ) => {
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setScheduledLocations(prev =>
        prev.map(schedule =>
          schedule.id === scheduleId ? { ...schedule, status } : schedule
        )
      );
      return true;
    } catch (err) {
      setError('Failed to update schedule status');
      return false;
    }
  };

  return {
    scheduledLocations,
    loading,
    error,
    getTodaySchedule,
    getUpcomingSchedule,
    updateScheduleStatus,
    refresh: fetchScheduledLocations
  };
};
