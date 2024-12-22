import React, { useState, useEffect } from 'react';
import { useJobLocations } from '../hooks/useJobLocations';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { TimeEntry } from '../types';

interface TimeEntryEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TimeEntryFormData) => void;
  entry?: TimeEntry;
}

interface TimeEntryFormData {
  startTime: string;
  endTime: string;
  jobLocation: string;
  description: string;
}

export const TimeEntryEditModal: React.FC<TimeEntryEditModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  entry,
}) => {
  const { jobLocations } = useJobLocations();
  const [formData, setFormData] = useState<TimeEntryFormData>({
    startTime: '',
    endTime: '',
    jobLocation: '',
    description: '',
  });

  useEffect(() => {
    if (entry) {
      setFormData({
        startTime: new Date(entry.startTime).toISOString().slice(0, 16),
        endTime: entry.endTime ? new Date(entry.endTime).toISOString().slice(0, 16) : '',
        jobLocation: entry.jobLocation,
        description: entry.description,
      });
    }
  }, [entry]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.startTime || !formData.endTime || !formData.jobLocation) {
      alert('Please fill in all required fields');
      return;
    }
    onSubmit(formData);
    onClose();
  };

  const formatJobLocation = (location?: { name: string; city: string; state: string }): string => {
    if (!location) return '';
    return `${location.name} - ${location.city}, ${location.state}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {entry ? 'Edit Time Entry' : 'New Time Entry'}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time *
                </label>
                <input
                  type="datetime-local"
                  value={formData.startTime}
                  onChange={(e) =>
                    setFormData({ ...formData, startTime: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Time *
                </label>
                <input
                  type="datetime-local"
                  value={formData.endTime}
                  onChange={(e) =>
                    setFormData({ ...formData, endTime: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Location *
                </label>
                <Select
                  value={formData.jobLocation}
                  onValueChange={(value) =>
                    setFormData({ ...formData, jobLocation: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue>
                      {formData.jobLocation
                        ? formatJobLocation(
                            jobLocations.find(
                              (loc) => loc.name === formData.jobLocation
                            )
                          )
                        : 'Select a job location'}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {jobLocations.map((location) => (
                      <SelectItem key={location.id} value={location.name}>
                        {formatJobLocation(location)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md"
                  rows={3}
                  placeholder="Add any notes about your work..."
                />
              </div>

              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="submit"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {entry ? 'Save Changes' : 'Submit'}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
