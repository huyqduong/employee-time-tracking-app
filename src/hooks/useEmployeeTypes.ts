import { useState, useCallback } from 'react';
import { EmployeeType } from '../types';

const mockEmployeeTypes: EmployeeType[] = [
  {
    id: '1',
    name: 'Cleaner',
    description: 'General cleaning and maintenance staff',
    qualifications: ['Basic cleaning certification'],
    allowedJobLocations: ['office', 'retail', 'residential'],
  },
  {
    id: '2',
    name: 'Security Guard',
    description: 'Security personnel for monitoring and protection',
    qualifications: ['Security license', 'First aid certification'],
    allowedJobLocations: ['office', 'retail'],
  },
  {
    id: '3',
    name: 'Maintenance Technician',
    description: 'Skilled maintenance and repair staff',
    qualifications: ['Technical certification', 'HVAC license'],
    allowedJobLocations: ['office', 'residential'],
  },
];

export const useEmployeeTypes = () => {
  const [employeeTypes, setEmployeeTypes] = useState<EmployeeType[]>(mockEmployeeTypes);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployeeTypes = useCallback(async () => {
    setLoading(true);
    try {
      // Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setEmployeeTypes(mockEmployeeTypes);
      setError(null);
    } catch (err) {
      setError('Failed to fetch employee types');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    employeeTypes,
    loading,
    error,
    fetchEmployeeTypes,
  };
};
