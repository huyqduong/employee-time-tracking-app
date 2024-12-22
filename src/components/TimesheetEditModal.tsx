import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { useJobLocations, getJobLocationDisplay, JobLocation } from '../hooks/useJobLocations';

interface TimesheetEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (editedData: EditedTimesheet) => void;
  timeEntry: {
    id: string;
    employeeName: string;
    date: string;
    startTime: string;
    endTime: string;
    jobLocation: string;
    description: string;
    totalHours: number;
  };
}

interface EditedTimesheet {
  startTime: string;
  endTime: string;
  jobLocation: string;
  description: string;
  totalHours: number;
  managerNotes: string;
}

const TimesheetEditModal: React.FC<TimesheetEditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  timeEntry,
}) => {
  const { jobLocations, loading, error } = useJobLocations();
  const [editedData, setEditedData] = useState<EditedTimesheet>({
    startTime: '',
    endTime: '',
    jobLocation: '',
    description: '',
    totalHours: 0,
    managerNotes: '',
  });

  useEffect(() => {
    if (timeEntry) {
      setEditedData({
        startTime: timeEntry.startTime,
        endTime: timeEntry.endTime,
        jobLocation: timeEntry.jobLocation,
        description: timeEntry.description,
        totalHours: timeEntry.totalHours,
        managerNotes: '',
      });
    }
  }, [timeEntry]);

  const getSelectedLocationDisplay = () => {
    const selectedLocation = jobLocations.find(loc => loc.name === editedData.jobLocation);
    return selectedLocation ? getJobLocationDisplay(selectedLocation) : '';
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editedData);
  };

  const calculateTotalHours = (start: string, end: string) => {
    const [startHour, startMinute] = start.split(':').map(Number);
    const [endHour, endMinute] = end.split(':').map(Number);
    const totalMinutes = (endHour * 60 + endMinute) - (startHour * 60 + startMinute);
    return Math.round((totalMinutes / 60) * 100) / 100;
  };

  const handleTimeChange = (field: 'startTime' | 'endTime', value: string) => {
    setEditedData(prev => {
      const newData = { ...prev, [field]: value };
      if (newData.startTime && newData.endTime) {
        newData.totalHours = calculateTotalHours(newData.startTime, newData.endTime);
      }
      return newData;
    });
  };

  const handleLocationChange = (value: string) => {
    setEditedData(prev => ({
      ...prev,
      jobLocation: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
        <h2 className="text-lg font-semibold mb-4">
          Edit Timesheet - {timeEntry.employeeName}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Time
              </label>
              <Input
                type="time"
                value={editedData.startTime}
                onChange={(e) => handleTimeChange('startTime', e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Time
              </label>
              <Input
                type="time"
                value={editedData.endTime}
                onChange={(e) => handleTimeChange('endTime', e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Location
            </label>
            {loading ? (
              <div className="text-sm text-gray-500">Loading job locations...</div>
            ) : error ? (
              <div className="text-sm text-red-500">{error}</div>
            ) : (
              <Select
                value={editedData.jobLocation}
                onValueChange={handleLocationChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue>
                    {editedData.jobLocation ? getSelectedLocationDisplay() : "Select a job location"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {jobLocations.map((location) => (
                    <SelectItem key={location.id} value={location.name}>
                      {getJobLocationDisplay(location)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={editedData.description}
              onChange={(e) => setEditedData({ ...editedData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              rows={2}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Manager Notes
            </label>
            <textarea
              value={editedData.managerNotes}
              onChange={(e) => setEditedData({ ...editedData, managerNotes: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              rows={3}
              placeholder="Add any notes or comments about this timesheet entry..."
            />
          </div>

          <div className="pt-2">
            <p className="text-sm text-gray-600">
              Total Hours: {editedData.totalHours}
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              className="bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-primary-500 hover:bg-primary-600">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TimesheetEditModal;
