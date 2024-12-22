import React from 'react';
import { TimeEntryForm } from '../components/TimeEntryForm';

export const TimeEntryPage: React.FC = () => {
  const handleTimeEntrySubmit = async (data: {
    startTime: string;
    endTime?: string;
    jobLocation: string;
    description: string;
  }) => {
    // TODO: Replace with actual API call
    console.log('Submitting time entry:', data);
    
    // Mock API call
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (data.endTime) {
        alert('Time entry submitted successfully!');
      } else {
        alert('Clocked in successfully!');
      }
    } catch (error) {
      alert('Error submitting time entry. Please try again.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Time Entry</h1>
      <div className="max-w-2xl">
        <TimeEntryForm onSubmit={handleTimeEntrySubmit} />
      </div>
    </div>
  );
};
