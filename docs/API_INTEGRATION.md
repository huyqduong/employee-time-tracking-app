# API Integration Documentation

## Authentication Endpoints

### Login
```typescript
POST /api/auth/login
Request:
{
  email: string;
  password: string;
}
Response:
{
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'employee';
  }
}
```

### Logout
```typescript
POST /api/auth/logout
Response: 200 OK
```

## Time Tracking Endpoints

### Clock In
```typescript
POST /api/time-entries/clock-in
Request:
{
  userId: string;
  taskId?: string;
  notes?: string;
}
Response:
{
  id: string;
  startTime: string;
  userId: string;
  taskId?: string;
}
```

### Clock Out
```typescript
POST /api/time-entries/clock-out
Request:
{
  timeEntryId: string;
  notes?: string;
}
Response:
{
  id: string;
  startTime: string;
  endTime: string;
  duration: number;
}
```

### Get Time Entries
```typescript
GET /api/time-entries
Query Parameters:
{
  userId?: string;
  startDate?: string;
  endDate?: string;
  status?: 'active' | 'completed';
}
Response:
{
  timeEntries: Array<{
    id: string;
    userId: string;
    taskId?: string;
    startTime: string;
    endTime?: string;
    duration: number;
    notes?: string;
  }>
}
```

## Task Management Endpoints

### Create Task
```typescript
POST /api/tasks
Request:
{
  title: string;
  description: string;
  assignedTo: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
}
Response:
{
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  status: 'todo';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  createdAt: string;
}
```

### Update Task Status
```typescript
PATCH /api/tasks/:taskId/status
Request:
{
  status: 'todo' | 'in-progress' | 'completed';
}
Response:
{
  id: string;
  status: string;
  updatedAt: string;
}
```

### Get Tasks
```typescript
GET /api/tasks
Query Parameters:
{
  assignedTo?: string;
  status?: 'todo' | 'in-progress' | 'completed';
  priority?: 'low' | 'medium' | 'high';
}
Response:
{
  tasks: Array<{
    id: string;
    title: string;
    description: string;
    assignedTo: string;
    status: string;
    priority: string;
    dueDate: string;
  }>
}
```

## User Management Endpoints

### Create User
```typescript
POST /api/users
Request:
{
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'employee';
  department: string;
}
Response:
{
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  createdAt: string;
}
```

### Update User
```typescript
PUT /api/users/:userId
Request:
{
  name?: string;
  email?: string;
  role?: 'admin' | 'employee';
  department?: string;
}
Response:
{
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  updatedAt: string;
}
```

### Get Users
```typescript
GET /api/users
Query Parameters:
{
  role?: 'admin' | 'employee';
  department?: string;
}
Response:
{
  users: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    department: string;
  }>
}
```

## Reports Endpoints

### Generate Time Report
```typescript
GET /api/reports/time
Query Parameters:
{
  startDate: string;
  endDate: string;
  userId?: string;
  department?: string;
}
Response:
{
  totalHours: number;
  entries: Array<{
    date: string;
    hours: number;
    user: {
      id: string;
      name: string;
    };
    task?: {
      id: string;
      title: string;
    };
  }>;
}
```

### Generate Department Report
```typescript
GET /api/reports/department
Query Parameters:
{
  department: string;
  startDate: string;
  endDate: string;
}
Response:
{
  department: string;
  totalHours: number;
  employeeCount: number;
  averageHoursPerEmployee: number;
  topPerformers: Array<{
    userId: string;
    name: string;
    hours: number;
  }>;
}
```

## Error Handling

All endpoints follow a consistent error response format:

```typescript
{
  error: {
    code: string;
    message: string;
    details?: any;
  }
}
```

Common error codes:
- `AUTH_ERROR`: Authentication related errors
- `VALIDATION_ERROR`: Invalid input data
- `NOT_FOUND`: Requested resource not found
- `PERMISSION_DENIED`: User lacks required permissions
- `SERVER_ERROR`: Internal server error

## API Integration Guidelines

1. **Authentication**
   - Use JWT tokens for authentication
   - Include token in Authorization header
   - Handle token refresh automatically

2. **Error Handling**
   - Implement global error handling
   - Show appropriate error messages to users
   - Log errors for debugging

3. **Data Caching**
   - Cache frequently accessed data
   - Implement optimistic updates
   - Handle offline functionality

4. **Real-time Updates**
   - Use WebSocket for real-time features
   - Implement retry mechanism for failed connections
   - Handle connection state changes

5. **Performance**
   - Implement request debouncing
   - Use pagination for large datasets
   - Optimize payload size
