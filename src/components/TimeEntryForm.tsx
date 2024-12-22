import React, { useState } from 'react';
import { useJobLocations } from '../hooks/useJobLocations';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface TimeEntryFormProps {
  onSubmit: (data: {
    startTime: string;
    endTime?: string;
    jobLocation: string;
    description: string;
  }) => void;
}

export const TimeEntryForm: React.FC<TimeEntryFormProps> = ({ onSubmit }) => {
  const { jobLocations, loading, error } = useJobLocations();
  const [selectedLocation, setSelectedLocation] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');

  const formatJobLocation = (location?: { name: string; city: string; state: string }): string => {
    if (!location) return '';
    return `${location.name} - ${location.city}, ${location.state}`;
  };

  const handleClockIn = () => {
    if (!selectedLocation) {
      alert('Please select a job location');
      return;
    }
    const now = new Date().toISOString();
    setStartTime(now);
    onSubmit({
      startTime: now,
      jobLocation: selectedLocation,
      description,
    });
  };

  const handleClockOut = () => {
    if (!startTime) {
      alert('You need to clock in first');
      return;
    }
    const now = new Date().toISOString();
    setEndTime(now);
    onSubmit({
      startTime,
      endTime: now,
      jobLocation: selectedLocation,
      description,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLocation || !startTime || !endTime) {
      alert('Please fill in all required fields');
      return;
    }
    onSubmit({
      startTime,
      endTime,
      jobLocation: selectedLocation,
      description,
    });
  };

  if (loading) return <div>Loading job locations...</div>;
  if (error) return <div>Error loading job locations: {error}</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-lg shadow">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Job Location *
        </label>
        <Select
          value={selectedLocation}
          onValueChange={setSelectedLocation}
        >
          <SelectTrigger className="w-full">
            <SelectValue>
              {selectedLocation ? 
                formatJobLocation(jobLocations.find(loc => loc.name === selectedLocation)) 
                : "Select a job location"}
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
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
          rows={3}
          placeholder="Add any notes about your work..."
        />
      </div>

      <div className="flex space-x-4">
        <button
          type="button"
          onClick={handleClockIn}
          disabled={!!startTime}
          className={`px-4 py-2 rounded-md ${
            startTime
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          Clock In
        </button>
        <button
          type="button"
          onClick={handleClockOut}
          disabled={!startTime || !!endTime}
          className={`px-4 py-2 rounded-md ${
            !startTime || !!endTime
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-red-500 hover:bg-red-600 text-white'
          }`}
        >
          Clock Out
        </button>
      </div>

      {startTime && (
        <div className="text-sm text-gray-600">
          Clocked in at: {new Date(startTime).toLocaleString()}
        </div>
      )}
      {endTime && (
        <div className="text-sm text-gray-600">
          Clocked out at: {new Date(endTime).toLocaleString()}
        </div>
      )}
    </form>
  );
};
