import React, { useState } from 'react';
import { Tab } from '@headlessui/react';
import { ScheduleTemplateManager } from '../components/ScheduleTemplate/ScheduleTemplateManager';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const ScheduleManagement: React.FC = () => {
  const tabs = [
    { name: 'Templates', component: <ScheduleTemplateManager /> },
    { name: 'Calendar', component: <div>Calendar View Coming Soon</div> },
    { name: 'Assignments', component: <div>Employee Assignments Coming Soon</div> },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Schedule Management</h1>
        <p className="text-gray-600">
          Create and manage schedule templates, view calendar, and assign employees
        </p>
      </div>

      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-primary-900/20 p-1">
          {tabs.map(tab => (
            <Tab
              key={tab.name}
              className={({ selected }) =>
                classNames(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                  'ring-white ring-opacity-60 ring-offset-2 ring-offset-primary-400 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-white text-primary-700 shadow'
                    : 'text-gray-600 hover:bg-white/[0.12] hover:text-primary-600'
                )
              }
            >
              {tab.name}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-6">
          {tabs.map((tab, idx) => (
            <Tab.Panel
              key={idx}
              className={classNames(
                'rounded-xl bg-white p-3',
                'ring-white ring-opacity-60 ring-offset-2 ring-offset-primary-400 focus:outline-none focus:ring-2'
              )}
            >
              {tab.component}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default ScheduleManagement;
