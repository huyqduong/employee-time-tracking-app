import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { ScheduleTemplate } from '../../types';
import { Button } from '../ui/button';
import { format, addDays } from 'date-fns';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onApply: (templateId: string, startDate: Date, endDate: Date) => void;
  template: ScheduleTemplate;
}

export const ScheduleTemplateApplyModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onApply,
  template,
}) => {
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [duration, setDuration] = useState(7); // Default to 1 week

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const start = new Date(startDate);
    const end = addDays(start, duration);
    onApply(template.id, start, end);
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-10 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

        <div className="relative bg-white rounded-lg max-w-md w-full mx-4 p-6">
          <div className="absolute top-4 right-4">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <Dialog.Title className="text-lg font-medium mb-4">
            Apply Schedule Template
          </Dialog.Title>

          <p className="text-sm text-gray-600 mb-4">
            Apply "{template.name}" template to schedule employees
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                min={format(new Date(), 'yyyy-MM-dd')}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Duration (days)
              </label>
              <select
                value={duration}
                onChange={e => setDuration(parseInt(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value={7}>1 week</option>
                <option value={14}>2 weeks</option>
                <option value={21}>3 weeks</option>
                <option value={28}>4 weeks</option>
              </select>
            </div>

            <div className="mt-4 bg-gray-50 -mx-6 -mb-6 px-6 py-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Template Summary</h4>
              <div className="text-sm text-gray-600">
                <p className="mb-2">Location: {template.jobLocationId}</p>
                <p className="mb-1">Shifts:</p>
                <ul className="list-disc list-inside space-y-1">
                  {template.shifts.map((shift, index) => (
                    <li key={index}>
                      {shift.dayOfWeek.charAt(0).toUpperCase() + shift.dayOfWeek.slice(1)}:{' '}
                      {shift.startTime} - {shift.endTime} ({shift.numberOfEmployees} employees)
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                onClick={onClose}
                variant="secondary"
              >
                Cancel
              </Button>
              <Button type="submit">
                Apply Template
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  );
};
