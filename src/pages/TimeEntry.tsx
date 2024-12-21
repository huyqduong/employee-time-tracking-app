import React, { useState } from 'react';
import { PlayIcon, StopIcon } from '@heroicons/react/24/solid';

const TimeEntry = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [selectedProject, setSelectedProject] = useState('');
  const [description, setDescription] = useState('');

  const projects = [
    { id: '1', name: 'Website Redesign' },
    { id: '2', name: 'Mobile App Development' },
    { id: '3', name: 'Client Meetings' },
  ];

  const todayEntries = [
    { project: 'Website Redesign', duration: '2:30', description: 'Homepage layout updates' },
    { project: 'Mobile App Development', duration: '1:45', description: 'API integration' },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Time Entry</h1>
        <p className="mt-2 text-sm text-gray-700">Track your time on projects and tasks.</p>
      </div>

      {/* Time Entry Form */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <div className="space-y-6">
          <div>
            <label htmlFor="project" className="block text-sm font-medium text-gray-700">
              Project
            </label>
            <select
              id="project"
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
            >
              <option value="">Select a project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="What are you working on?"
            />
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => setIsTracking(!isTracking)}
              className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white ${
                isTracking
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-primary-600 hover:bg-primary-700'
              }`}
            >
              {isTracking ? (
                <>
                  <StopIcon className="h-5 w-5 mr-2" />
                  Stop Timer
                </>
              ) : (
                <>
                  <PlayIcon className="h-5 w-5 mr-2" />
                  Start Timer
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Today's Entries */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-lg font-medium text-gray-900">Today's Entries</h2>
        </div>
        <div className="border-t border-gray-200">
          <ul role="list" className="divide-y divide-gray-200">
            {todayEntries.map((entry, index) => (
              <li key={index} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{entry.project}</p>
                    <p className="text-sm text-gray-500">{entry.description}</p>
                  </div>
                  <div className="text-sm text-gray-500">{entry.duration}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TimeEntry;
