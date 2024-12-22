import { useState, useEffect } from 'react';

export interface JobLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  isActive: boolean;
}

// This would be replaced with actual API calls in production
const mockJobLocations: JobLocation[] = [
  {
    id: '1',
    name: 'Main Office',
    address: '123 Main St',
    city: 'San Francisco',
    state: 'CA',
    zip: '94105',
    isActive: true,
  },
  {
    id: '2',
    name: 'Downtown Branch',
    address: '456 Market St',
    city: 'San Francisco',
    state: 'CA',
    zip: '94103',
    isActive: true,
  },
  {
    id: '3',
    name: 'South Bay Office',
    address: '789 Tech Dr',
    city: 'San Jose',
    state: 'CA',
    zip: '95110',
    isActive: true,
  },
];

export const useJobLocations = () => {
  const [jobLocations, setJobLocations] = useState<JobLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobLocations = async () => {
      try {
        // In production, this would be an API call
        // const response = await fetch('/api/job-locations');
        // const data = await response.json();
        
        // Simulating API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setJobLocations(mockJobLocations);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch job locations');
        setLoading(false);
      }
    };

    fetchJobLocations();
  }, []);

  return { jobLocations, loading, error };
};

export const getJobLocationDisplay = (location: JobLocation) => {
  return `${location.name} - ${location.city}, ${location.state}`;
};
