import React, { useState, useEffect } from 'react';
import {
  PlayIcon,
  StopIcon,
  PauseIcon,
  ClockIcon,
  ArrowPathIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

interface Task {
  id: string;
  name: string;
  description: string;
  status: 'Not Started' | 'In Progress' | 'Completed';
  timeSpent: number; // in seconds
  isRunning: boolean;
}

interface Break {
  id: string;
  startTime: string;
  endTime: string | null;
  duration: number | null; // in minutes
  type: 'Lunch' | 'Short Break' | 'Other';
}

const TimeTracking = () => {
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState<string | null>(null);
  const [currentBreak, setCurrentBreak] = useState<Break | null>(null);
  const [breaks, setBreaks] = useState<Break[]>([]);
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      name: 'Website Development',
      description: 'Implement new features',
      status: 'In Progress',
      timeSpent: 3600, // 1 hour
      isRunning: false,
    },
    {
      id: '2',
      name: 'Bug Fixes',
      description: 'Fix reported issues',
      status: 'Not Started',
      timeSpent: 0,
      isRunning: false,
    },
  ]);

  // Timer effect for running tasks
  useEffect(() => {
    const interval = setInterval(() => {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.isRunning ? { ...task, timeSpent: task.timeSpent + 1 } : task
        )
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleClockInOut = () => {
    if (!isClockedIn) {
      setIsClockedIn(true);
      setClockInTime(new Date().toLocaleTimeString());
    } else {
      setIsClockedIn(false);
      setClockInTime(null);
      // Stop all running tasks
      setTasks((prevTasks) =>
        prevTasks.map((task) => ({ ...task, isRunning: false }))
      );
    }
  };

  const handleTaskTimer = (taskId: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === taskId) {
          return { ...task, isRunning: !task.isRunning };
        }
        return task;
      })
    );
  };

  const startBreak = (type: Break['type']) => {
    const newBreak: Break = {
      id: Date.now().toString(),
      startTime: new Date().toLocaleTimeString(),
      endTime: null,
      duration: null,
      type,
    };
    setCurrentBreak(newBreak);
    // Pause all running tasks
    setTasks((prevTasks) =>
      prevTasks.map((task) => ({ ...task, isRunning: false }))
    );
  };

  const endBreak = () => {
    if (currentBreak) {
      const endTime = new Date().toLocaleTimeString();
      const updatedBreak: Break = {
        ...currentBreak,
        endTime,
        duration: 30, // Calculate actual duration
      };
      setBreaks([...breaks, updatedBreak]);
      setCurrentBreak(null);
    }
  };

  return (
    <div className="p-6">
      {/* Clock In/Out Section */}
      <div className="mb-8 bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-gray-900">Time Tracking</h2>
            {isClockedIn && (
              <p className="text-sm text-gray-500">
                Clocked in at {clockInTime}
              </p>
            )}
          </div>
          <button
            onClick={handleClockInOut}
            className={`inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white ${
              isClockedIn
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-primary-600 hover:bg-primary-700'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
          >
            {isClockedIn ? (
              <>
                <StopIcon className="h-5 w-5 mr-2" />
                Clock Out
              </>
            ) : (
              <>
                <PlayIcon className="h-5 w-5 mr-2" />
                Clock In
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Tasks Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Assigned Tasks
              </h3>
            </div>
            <ul className="divide-y divide-gray-200">
              {tasks.map((task) => (
                <li key={task.id} className="px-4 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0 mr-4">
                      <p className="text-sm font-medium text-gray-900">
                        {task.name}
                      </p>
                      <p className="text-sm text-gray-500">{task.description}</p>
                      <div className="mt-2 flex items-center">
                        <ClockIcon className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-500">
                          {formatTime(task.timeSpent)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleTaskTimer(task.id)}
                      disabled={!isClockedIn || (currentBreak !== null)}
                      className={`inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                        task.isRunning
                          ? 'bg-yellow-500 hover:bg-yellow-600'
                          : 'bg-primary-600 hover:bg-primary-700'
                      } ${
                        !isClockedIn || currentBreak
                          ? 'opacity-50 cursor-not-allowed'
                          : ''
                      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
                    >
                      {task.isRunning ? (
                        <>
                          <PauseIcon className="h-4 w-4 mr-1" />
                          Pause
                        </>
                      ) : (
                        <>
                          <PlayIcon className="h-4 w-4 mr-1" />
                          Start
                        </>
                      )}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Breaks and Summary Section */}
        <div className="space-y-8">
          {/* Breaks Section */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Breaks</h3>
            </div>
            <div className="p-4">
              {currentBreak ? (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">
                      Current Break
                    </span>
                    <span className="text-sm text-gray-500">
                      Started at {currentBreak.startTime}
                    </span>
                  </div>
                  <button
                    onClick={endBreak}
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <ArrowPathIcon className="h-4 w-4 mr-1" />
                    End Break
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={() => startBreak('Lunch')}
                    disabled={!isClockedIn}
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Start Lunch Break
                  </button>
                  <button
                    onClick={() => startBreak('Short Break')}
                    disabled={!isClockedIn}
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Start Short Break
                  </button>
                </div>
              )}

              {/* Break History */}
              {breaks.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    Break History
                  </h4>
                  <ul className="space-y-2">
                    {breaks.map((break_) => (
                      <li
                        key={break_.id}
                        className="text-sm text-gray-500 flex justify-between"
                      >
                        <span>{break_.type}</span>
                        <span>
                          {break_.duration} mins
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Daily Summary */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Daily Summary</h3>
            </div>
            <div className="p-4">
              <dl className="space-y-4">
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Total Time</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {formatTime(
                      tasks.reduce((acc, task) => acc + task.timeSpent, 0)
                    )}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">
                    Break Time
                  </dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {breaks.reduce((acc, break_) => acc + (break_.duration || 0), 0)} mins
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">
                    Tasks Completed
                  </dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {tasks.filter((task) => task.status === 'Completed').length} /{' '}
                    {tasks.length}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeTracking;
