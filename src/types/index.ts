export interface JobLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  isActive: boolean;
  requiredEmployeeTypes: {
    employeeTypeId: string;
    minEmployees: number;
    preferredEmployees: number;
  }[];
  specialRequirements?: string[];
  operatingHours: {
    [key in DayOfWeek]: {
      open: string;
      close: string;
    };
  };
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

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: 'admin' | 'employee';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeType {
  id: string;
  name: string;
  description: string;
  qualifications: string[];
  allowedJobLocations: string[];
}

export interface Employee extends User {
  employeeType: EmployeeType;
  preferredLocations?: string[];
  maxHoursPerWeek: number;
  availability: {
    [key in DayOfWeek]: {
      available: boolean;
      hours: string[];
    };
  };
  skills: string[];
  certifications: {
    name: string;
    expiryDate: string;
  }[];
}

export interface ScheduleTemplate {
  id: string;
  name: string;
  jobLocationId: string;
  shifts: {
    dayOfWeek: DayOfWeek;
    startTime: string;
    endTime: string;
    employeeTypeId: string;
    numberOfEmployees: number;
  }[];
}

export interface ScheduledShift {
  id: string;
  templateId?: string;
  jobLocationId: string;
  employeeId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  notes?: string;
}

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
