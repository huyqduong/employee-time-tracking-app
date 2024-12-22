import React, { useState } from 'react';
import { Button } from './ui/button';

interface TimesheetRejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReject: (reason: string) => void;
  employeeName: string;
}

const TimesheetRejectModal: React.FC<TimesheetRejectModalProps> = ({
  isOpen,
  onClose,
  onReject,
  employeeName,
}) => {
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onReject(reason);
    setReason('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-lg font-semibold mb-4">
          Reject Timesheet - {employeeName}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for Rejection
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              rows={4}
              required
              placeholder="Please provide a reason for rejecting this timesheet..."
            />
          </div>
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              onClick={onClose}
              className="bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-red-500 hover:bg-red-600">
              Reject Timesheet
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TimesheetRejectModal;
