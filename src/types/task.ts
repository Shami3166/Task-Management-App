export interface User {
    _id: string;
    name: string;
    email: string;
}

export interface Task {
    _id: string;
    title: string;
    description?: string;
    priority: 'low' | 'medium' | 'high';
    status: 'pending' | 'in-progress' | 'completed';
    dueDate?: string;
    user: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateTaskData {
    title: string;
    description?: string;
    priority: 'low' | 'medium' | 'high';
    status: 'pending' | 'in-progress' | 'completed';
    dueDate?: string;
}

export type UpdateTaskData = Partial<CreateTaskData>

export interface AuthResponse {
    _id: string;
    name: string;
    email: string;
    token: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
}

export interface FilterOptions {
    status?: string;
    priority?: string;
    search?: string;
}

export interface ApiError {
    message: string;
    status?: number;
}