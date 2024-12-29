import { useState, useCallback } from 'react';
import { ScheduleTemplate } from '../types';

// Mock data - replace with actual API calls
const mockTemplates: ScheduleTemplate[] = [
  {
    id: '1',
    name: 'Standard Weekday Schedule',
    jobLocationId: '1',
    shifts: [
      {
        dayOfWeek: 'monday',
        startTime: '09:00',
        endTime: '17:00',
        employeeTypeId: '1',
        numberOfEmployees: 2,
      },
      {
        dayOfWeek: 'tuesday',
        startTime: '09:00',
        endTime: '17:00',
        employeeTypeId: '1',
        numberOfEmployees: 2,
      },
      {
        dayOfWeek: 'wednesday',
        startTime: '09:00',
        endTime: '17:00',
        employeeTypeId: '1',
        numberOfEmployees: 2,
      },
      {
        dayOfWeek: 'thursday',
        startTime: '09:00',
        endTime: '17:00',
        employeeTypeId: '1',
        numberOfEmployees: 2,
      },
      {
        dayOfWeek: 'friday',
        startTime: '09:00',
        endTime: '17:00',
        employeeTypeId: '1',
        numberOfEmployees: 2,
      },
    ],
  },
  {
    id: '2',
    name: 'Weekend Schedule',
    jobLocationId: '1',
    shifts: [
      {
        dayOfWeek: 'saturday',
        startTime: '10:00',
        endTime: '16:00',
        employeeTypeId: '1',
        numberOfEmployees: 1,
      },
      {
        dayOfWeek: 'sunday',
        startTime: '10:00',
        endTime: '16:00',
        employeeTypeId: '1',
        numberOfEmployees: 1,
      },
    ],
  },
];

export const useScheduleTemplates = () => {
  const [templates, setTemplates] = useState<ScheduleTemplate[]>(mockTemplates);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    try {
      // Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTemplates(mockTemplates);
      setError(null);
    } catch (err) {
      setError('Failed to fetch schedule templates');
    } finally {
      setLoading(false);
    }
  }, []);

  const createTemplate = useCallback(async (template: Omit<ScheduleTemplate, 'id'>) => {
    setLoading(true);
    try {
      // Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newTemplate: ScheduleTemplate = {
        ...template,
        id: Date.now().toString(),
      };
      setTemplates(prev => [...prev, newTemplate]);
      setError(null);
      return newTemplate;
    } catch (err) {
      setError('Failed to create schedule template');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTemplate = useCallback(async (template: ScheduleTemplate) => {
    setLoading(true);
    try {
      // Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTemplates(prev =>
        prev.map(t => (t.id === template.id ? template : t))
      );
      setError(null);
    } catch (err) {
      setError('Failed to update schedule template');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTemplate = useCallback(async (templateId: string) => {
    setLoading(true);
    try {
      // Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTemplates(prev => prev.filter(t => t.id !== templateId));
      setError(null);
    } catch (err) {
      setError('Failed to delete schedule template');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const applyTemplate = useCallback(async (templateId: string, startDate: Date, endDate: Date) => {
    setLoading(true);
    try {
      // Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // This would typically create actual scheduled shifts based on the template
      setError(null);
    } catch (err) {
      setError('Failed to apply schedule template');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    templates,
    loading,
    error,
    fetchTemplates,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    applyTemplate,
  };
};
