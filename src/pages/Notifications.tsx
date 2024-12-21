import React, { useState } from 'react';
import {
  BellIcon,
  ClockIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon,
  CalendarIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { format, formatDistanceToNow } from 'date-fns';

interface Notification {
  id: string;
  type: 'task' | 'deadline' | 'shift' | 'reminder' | 'system';
  message: string;
  timestamp: Date;
  isRead: boolean;
  priority: 'high' | 'medium' | 'low';
  relatedId?: string;
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'task',
      message: 'New task assigned: Website Development',
      timestamp: new Date('2024-12-20T10:00:00'),
      isRead: false,
      priority: 'high',
      relatedId: 'task-1',
    },
    {
      id: '2',
      type: 'deadline',
      message: 'Upcoming deadline: Project Documentation due tomorrow',
      timestamp: new Date('2024-12-20T09:30:00'),
      isRead: false,
      priority: 'high',
      relatedId: 'task-2',
    },
    {
      id: '3',
      type: 'shift',
      message: 'Your shift starts in 1 hour',
      timestamp: new Date('2024-12-20T08:00:00'),
      isRead: true,
      priority: 'medium',
    },
    {
      id: '4',
      type: 'reminder',
      message: 'Team meeting at 2:00 PM',
      timestamp: new Date('2024-12-20T07:00:00'),
      isRead: true,
      priority: 'medium',
    },
    {
      id: '5',
      type: 'system',
      message: 'System maintenance scheduled for tonight at 10 PM',
      timestamp: new Date('2024-12-19T15:00:00'),
      isRead: false,
      priority: 'low',
    },
  ]);

  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'task':
        return <CheckCircleIcon className="h-6 w-6 text-blue-500" />;
      case 'deadline':
        return <ExclamationCircleIcon className="h-6 w-6 text-red-500" />;
      case 'shift':
        return <ClockIcon className="h-6 w-6 text-green-500" />;
      case 'reminder':
        return <CalendarIcon className="h-6 w-6 text-yellow-500" />;
      case 'system':
        return <BellIcon className="h-6 w-6 text-gray-500" />;
      default:
        return <BellIcon className="h-6 w-6 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((notification) => notification.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({ ...notification, isRead: true }))
    );
  };

  const deleteAllRead = () => {
    setNotifications(notifications.filter((notification) => !notification.isRead));
  };

  const filteredNotifications = notifications.filter((notification) => {
    switch (filter) {
      case 'unread':
        return !notification.isRead;
      case 'read':
        return notification.isRead;
      default:
        return true;
    }
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Notifications</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={markAllAsRead}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <CheckIcon className="h-4 w-4 mr-2" />
              Mark All as Read
            </button>
            <button
              onClick={deleteAllRead}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <TrashIcon className="h-4 w-4 mr-2" />
              Clear Read
            </button>
          </div>
        </div>
        
        {/* Filters */}
        <div className="mt-4 flex space-x-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              filter === 'all'
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              filter === 'unread'
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Unread
          </button>
          <button
            onClick={() => setFilter('read')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              filter === 'read'
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Read
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-lg shadow">
        {filteredNotifications.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No notifications to display
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filteredNotifications.map((notification) => (
              <li
                key={notification.id}
                className={`p-6 ${
                  !notification.isRead ? 'bg-primary-50' : ''
                } hover:bg-gray-50 transition-colors duration-150 ease-in-out`}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p
                        className={`text-sm font-medium ${
                          !notification.isRead ? 'text-gray-900' : 'text-gray-500'
                        }`}
                      >
                        {notification.message}
                      </p>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(
                            notification.priority
                          )}`}
                        >
                          {notification.priority}
                        </span>
                        <span className="text-sm text-gray-500">
                          {formatDistanceToNow(notification.timestamp, {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="mt-1 flex items-center space-x-4">
                      <span className="text-xs text-gray-500">
                        {format(notification.timestamp, 'MMM d, yyyy h:mm a')}
                      </span>
                      {!notification.isRead && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="inline-flex items-center text-xs text-primary-600 hover:text-primary-800"
                        >
                          <CheckIcon className="h-4 w-4 mr-1" />
                          Mark as read
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="inline-flex items-center text-xs text-red-600 hover:text-red-800"
                      >
                        <TrashIcon className="h-4 w-4 mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Notifications;
