import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { ScheduleTemplate, DayOfWeek } from '../../types';
import { Button } from '../ui/button';
import { useEmployeeTypes } from '../../hooks/useEmployeeTypes';
import { useJobLocations } from '../../hooks/useJobLocations';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (template: Omit<ScheduleTemplate, 'id'> | ScheduleTemplate) => void;
  template?: ScheduleTemplate;
}

const defaultShift = {
  dayOfWeek: 'monday' as DayOfWeek,
  startTime: '09:00',
  endTime: '17:00',
  employeeTypeId: '',
  numberOfEmployees: 1,
};

export const ScheduleTemplateEditModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSubmit,
  template,
}) => {
  const { employeeTypes } = useEmployeeTypes();
  const { jobLocations } = useJobLocations();
  const [formData, setFormData] = useState<Omit<ScheduleTemplate, 'id'>>({
    name: '',
    jobLocationId: '',
    shifts: [defaultShift],
  });

  useEffect(() => {
    if (template) {
      setFormData({
        name: template.name,
        jobLocationId: template.jobLocationId,
        shifts: template.shifts,
      });
    } else {
      setFormData({
        name: '',
        jobLocationId: '',
        shifts: [defaultShift],
      });
    }
  }, [template]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (template) {
      onSubmit({ ...formData, id: template.id });
    } else {
      onSubmit(formData);
    }
    onClose();
  };

  const handleAddShift = () => {
    setFormData(prev => ({
      ...prev,
      shifts: [...prev.shifts, defaultShift],
    }));
  };

  const handleRemoveShift = (index: number) => {
    setFormData(prev => ({
      ...prev,
      shifts: prev.shifts.filter((_, i) => i !== index),
    }));
  };

  const handleShiftChange = (index: number, field: keyof typeof defaultShift, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      shifts: prev.shifts.map((shift, i) =>
        i === index ? { ...shift, [field]: value } : shift
      ),
    }));
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
            {template ? 'Edit Schedule Template' : 'Create Schedule Template'}
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Template Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Job Location
              </label>
              <select
                value={formData.jobLocationId}
                onChange={e => setFormData(prev => ({ ...prev, jobLocationId: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                required
              >
                <option value="">Select a location</option>
                {jobLocations.map(location => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-700">
                  Shifts
                </label>
                <Button
                  type="button"
                  onClick={handleAddShift}
                  variant="secondary"
                  size="sm"
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Add Shift
                </Button>
              </div>

              {formData.shifts.map((shift, index) => (
                <div key={index} className="border rounded-md p-4 space-y-3">
                  <div className="flex justify-between">
                    <h4 className="text-sm font-medium">Shift {index + 1}</h4>
                    {formData.shifts.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveShift(index)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-gray-700">Day</label>
                      <select
                        value={shift.dayOfWeek}
                        onChange={e => handleShiftChange(index, 'dayOfWeek', e.target.value as DayOfWeek)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      >
                        {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                          <option key={day} value={day}>
                            {day.charAt(0).toUpperCase() + day.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700">Employee Type</label>
                      <select
                        value={shift.employeeTypeId}
                        onChange={e => handleShiftChange(index, 'employeeTypeId', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        required
                      >
                        <option value="">Select type</option>
                        {employeeTypes.map(type => (
                          <option key={type.id} value={type.id}>
                            {type.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700">Start Time</label>
                      <input
                        type="time"
                        value={shift.startTime}
                        onChange={e => handleShiftChange(index, 'startTime', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700">End Time</label>
                      <input
                        type="time"
                        value={shift.endTime}
                        onChange={e => handleShiftChange(index, 'endTime', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700">Number of Employees</label>
                      <input
                        type="number"
                        min="1"
                        value={shift.numberOfEmployees}
                        onChange={e => handleShiftChange(index, 'numberOfEmployees', parseInt(e.target.value))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
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
                {template ? 'Save Changes' : 'Create Template'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  );
};
