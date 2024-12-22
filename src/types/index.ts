export interface JobLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  isActive: boolean;
}

export interface ScheduledJobLocation {
  id: string;
  jobLocationId: string;
  jobLocation: JobLocation;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  notes?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
}

export interface TimeEntry {
  id: string;
  startTime: string;
  endTime?: string;
  jobLocation: string;
  scheduledJobLocationId?: string;
  description: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  totalHours?: number;
}
