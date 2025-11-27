export const API_BASE_URL = 'http://localhost:5000/api';

export const PRIORITY_OPTIONS = [
    { value: 'low', label: 'Low', color: 'bg-green-100 text-green-800' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'high', label: 'High', color: 'bg-red-100 text-red-800' },
] as const;

export const STATUS_OPTIONS = [
    { value: 'pending', label: 'Pending', color: 'bg-gray-100 text-gray-800' },
    { value: 'in-progress', label: 'In Progress', color: 'bg-blue-100 text-blue-800' },
    { value: 'completed', label: 'Completed', color: 'bg-green-100 text-green-800' },
] as const;

export const TASK_FORM_DEFAULT_VALUES = {
    title: '',
    description: '',
    priority: 'medium' as const,
    status: 'pending' as const,
    dueDate: '',
};

export const STORAGE_KEYS = {
    AUTH_TOKEN: 'taskManagerToken',
    USER_DATA: 'taskManagerUser',
} as const;

export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
} as const;