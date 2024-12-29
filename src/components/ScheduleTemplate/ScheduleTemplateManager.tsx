import React, { useState, useEffect } from 'react';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';
import { useScheduleTemplates } from '../../hooks/useScheduleTemplates';
import { ScheduleTemplate } from '../../types';
import { Button } from '../ui/button';
import { ScheduleTemplateEditModal } from './ScheduleTemplateEditModal';
import { ScheduleTemplateApplyModal } from './ScheduleTemplateApplyModal';

export const ScheduleTemplateManager: React.FC = () => {
  const {
    templates,
    loading,
    error,
    fetchTemplates,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    applyTemplate,
  } = useScheduleTemplates();

  const [selectedTemplate, setSelectedTemplate] = useState<ScheduleTemplate | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const handleEdit = (template: ScheduleTemplate) => {
    setSelectedTemplate(template);
    setIsEditModalOpen(true);
  };

  const handleApply = (template: ScheduleTemplate) => {
    setSelectedTemplate(template);
    setIsApplyModalOpen(true);
  };

  const handleDelete = async (templateId: string) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      try {
        await deleteTemplate(templateId);
      } catch (err) {
        console.error('Failed to delete template:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 p-4">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Schedule Templates</h2>
        <Button
          onClick={() => {
            setSelectedTemplate(null);
            setIsEditModalOpen(true);
          }}
          className="inline-flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          New Template
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {templates.map(template => (
          <div
            key={template.id}
            className="bg-white rounded-lg shadow p-4 border border-gray-200"
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-medium">{template.name}</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(template)}
                  className="text-blue-600 hover:text-blue-900"
                  title="Edit"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleApply(template)}
                  className="text-green-600 hover:text-green-900"
                  title="Apply Template"
                >
                  <CalendarIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDelete(template.id)}
                  className="text-red-600 hover:text-red-900"
                  title="Delete"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <p className="mb-2">Shifts:</p>
              <ul className="space-y-1">
                {template.shifts.map((shift, index) => (
                  <li key={index}>
                    {shift.dayOfWeek.charAt(0).toUpperCase() + shift.dayOfWeek.slice(1)}:{' '}
                    {shift.startTime} - {shift.endTime} ({shift.numberOfEmployees} employees)
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <ScheduleTemplateEditModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedTemplate(null);
        }}
        onSubmit={async (template) => {
          try {
            if ('id' in template) {
              await updateTemplate(template);
            } else {
              await createTemplate(template);
            }
          } catch (err) {
            console.error('Failed to save template:', err);
          }
        }}
        template={selectedTemplate || undefined}
      />

      {/* Only render ApplyModal when there's a selected template */}
      {selectedTemplate && (
        <ScheduleTemplateApplyModal
          isOpen={isApplyModalOpen}
          onClose={() => {
            setIsApplyModalOpen(false);
            setSelectedTemplate(null);
          }}
          onApply={async (templateId, startDate, endDate) => {
            try {
              await applyTemplate(templateId, startDate, endDate);
            } catch (err) {
              console.error('Failed to apply template:', err);
            }
          }}
          template={selectedTemplate}
        />
      )}
    </div>
  );
};
