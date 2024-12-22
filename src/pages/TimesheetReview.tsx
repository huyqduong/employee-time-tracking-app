import React, { useState } from 'react';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Button } from '../components/ui/button';
import { toast } from '../components/ui/use-toast';
import TimesheetRejectModal from '../components/TimesheetRejectModal';
import TimesheetEditModal from '../components/TimesheetEditModal';

interface TimeEntry {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  startTime: string;
  endTime: string;
  jobLocation: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  totalHours: number;
  comments?: string;
  managerNotes?: string;
}

// Mock data - replace with actual API calls
const mockTimeEntries: TimeEntry[] = [
  {
    id: '1',
    employeeId: 'emp1',
    employeeName: 'John Doe',
    date: '2024-12-21',
    startTime: '09:00',
    endTime: '17:00',
    jobLocation: 'Main Site',
    description: 'Regular shift',
    status: 'pending',
    totalHours: 8,
  },
  {
    id: '2',
    employeeId: 'emp2',
    employeeName: 'Jane Smith',
    date: '2024-12-21',
    startTime: '08:00',
    endTime: '16:30',
    jobLocation: 'Branch Office',
    description: 'Project work',
    status: 'pending',
    totalHours: 8.5,
  },
];

const TimesheetReview: React.FC = () => {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>(mockTimeEntries);
  const [selectedEntries, setSelectedEntries] = useState<Set<string>>(new Set());
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<TimeEntry | null>(null);
  const [approvalNote, setApprovalNote] = useState('');
  const [showApprovalNote, setShowApprovalNote] = useState(false);

  const handleApprove = (entryId: string) => {
    setTimeEntries(entries =>
      entries.map(entry =>
        entry.id === entryId
          ? {
              ...entry,
              status: 'approved',
              managerNotes: approvalNote || undefined,
            }
          : entry
      )
    );
    toast({
      title: 'Success',
      description: 'Timesheet entry approved',
    });
    setApprovalNote('');
    setShowApprovalNote(false);
  };

  const handleRejectClick = (entry: TimeEntry) => {
    setSelectedEntry(entry);
    setRejectModalOpen(true);
  };

  const handleEditClick = (entry: TimeEntry) => {
    setSelectedEntry(entry);
    setEditModalOpen(true);
  };

  const handleReject = (reason: string) => {
    if (!selectedEntry) return;

    setTimeEntries(entries =>
      entries.map(entry =>
        entry.id === selectedEntry.id
          ? { ...entry, status: 'rejected', comments: reason }
          : entry
      )
    );
    toast({
      title: 'Timesheet Rejected',
      description: 'The timesheet entry has been rejected',
    });
    setSelectedEntry(null);
  };

  const handleEdit = (editedData: any) => {
    if (!selectedEntry) return;

    setTimeEntries(entries =>
      entries.map(entry =>
        entry.id === selectedEntry.id
          ? {
              ...entry,
              ...editedData,
              managerNotes: editedData.managerNotes || entry.managerNotes,
            }
          : entry
      )
    );
    toast({
      title: 'Success',
      description: 'Timesheet entry updated',
    });
    setEditModalOpen(false);
    setSelectedEntry(null);
  };

  const handleBulkApprove = () => {
    setTimeEntries(entries =>
      entries.map(entry =>
        selectedEntries.has(entry.id)
          ? {
              ...entry,
              status: 'approved',
              managerNotes: approvalNote || undefined,
            }
          : entry
      )
    );
    setSelectedEntries(new Set());
    setApprovalNote('');
    toast({
      title: 'Success',
      description: 'Selected timesheet entries approved',
    });
  };

  const toggleEntrySelection = (entryId: string) => {
    const newSelected = new Set(selectedEntries);
    if (newSelected.has(entryId)) {
      newSelected.delete(entryId);
    } else {
      newSelected.add(entryId);
    }
    setSelectedEntries(newSelected);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Timesheet Review</h1>
        {selectedEntries.size > 0 && (
          <div className="flex items-center gap-4">
            {showApprovalNote ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={approvalNote}
                  onChange={(e) => setApprovalNote(e.target.value)}
                  placeholder="Add approval note..."
                  className="px-3 py-2 border rounded-md"
                />
                <Button
                  onClick={() => setShowApprovalNote(false)}
                  className="bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => setShowApprovalNote(true)}
                className="bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Add Note
              </Button>
            )}
            <Button onClick={handleBulkApprove}>
              Approve Selected ({selectedEntries.size})
            </Button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Select</TableHead>
              <TableHead>Employee</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Hours</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {timeEntries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>
                  <input
                    type="checkbox"
                    checked={selectedEntries.has(entry.id)}
                    onChange={() => toggleEntrySelection(entry.id)}
                    disabled={entry.status !== 'pending'}
                    className="rounded border-gray-300"
                  />
                </TableCell>
                <TableCell>{entry.employeeName}</TableCell>
                <TableCell>{format(new Date(entry.date), 'MMM dd, yyyy')}</TableCell>
                <TableCell>{`${entry.startTime} - ${entry.endTime}`}</TableCell>
                <TableCell>{entry.jobLocation}</TableCell>
                <TableCell>{entry.totalHours}</TableCell>
                <TableCell>{entry.description}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${entry.status === 'approved' ? 'bg-green-100 text-green-800' :
                      entry.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'}`}
                  >
                    {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                  </span>
                </TableCell>
                <TableCell>
                  {(entry.comments || entry.managerNotes) && (
                    <span
                      className="cursor-help text-sm text-gray-500"
                      title={`${entry.comments ? `Rejection Reason: ${entry.comments}\n` : ''}${
                        entry.managerNotes ? `Manager Notes: ${entry.managerNotes}` : ''
                      }`}
                    >
                      ℹ️
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    onClick={() => handleEditClick(entry)}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    Edit
                  </Button>
                  {entry.status === 'pending' && (
                    <>
                      <Button
                        onClick={() => handleApprove(entry.id)}
                        className="bg-green-500 hover:bg-green-600"
                      >
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleRejectClick(entry)}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        Reject
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedEntry && (
        <>
          <TimesheetRejectModal
            isOpen={rejectModalOpen}
            onClose={() => {
              setRejectModalOpen(false);
              setSelectedEntry(null);
            }}
            onReject={handleReject}
            employeeName={selectedEntry.employeeName}
          />
          <TimesheetEditModal
            isOpen={editModalOpen}
            onClose={() => {
              setEditModalOpen(false);
              setSelectedEntry(null);
            }}
            onSave={handleEdit}
            timeEntry={selectedEntry}
          />
        </>
      )}
    </div>
  );
};

export default TimesheetReview;
