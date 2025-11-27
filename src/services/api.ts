import type { ApiError, AuthResponse, CreateTaskData, LoginData, RegisterData, Task, UpdateTaskData, User } from '@/types/task';
import { API_BASE_URL, STORAGE_KEYS } from '../utils/constants';

class ApiService {
    private baseURL: string;

    constructor() {
        this.baseURL = API_BASE_URL;
    }

    private getAuthToken(): string | null {
        return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    }

    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const url = `${this.baseURL}${endpoint}`;
        const token = this.getAuthToken();

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...options.headers as Record<string, string>,
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        const config: RequestInit = {
            ...options,
            headers,
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw {
                    message: data.message || 'Something went wrong',
                    status: response.status,
                } as ApiError;
            }

            return data;
        } catch (error) {
            if (error instanceof Error) {
                throw {
                    message: error.message || 'Network error occurred',
                    status: 500,
                } as ApiError;
            }
            throw error;
        }
    }

    // Auth API calls
    async register(userData: RegisterData): Promise<AuthResponse> {
        return this.request<AuthResponse>('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    }

    async login(credentials: LoginData): Promise<AuthResponse> {
        return this.request<AuthResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
    }

    async getCurrentUser(): Promise<User> {
        return this.request<User>('/auth/me');
    }

    // Tasks API calls
    async getTasks(): Promise<Task[]> {
        return this.request<Task[]>('/tasks');
    }

    async getTask(id: string): Promise<Task> {
        return this.request<Task>(`/tasks/${id}`);
    }

    async createTask(taskData: CreateTaskData): Promise<Task> {
        return this.request<Task>('/tasks', {
            method: 'POST',
            body: JSON.stringify(taskData),
        });
    }

    async updateTask(id: string, taskData: UpdateTaskData): Promise<Task> {
        return this.request<Task>(`/tasks/${id}`, {
            method: 'PUT',
            body: JSON.stringify(taskData),
        });
    }

    async deleteTask(id: string): Promise<{ message: string }> {
        return this.request<{ message: string }>(`/tasks/${id}`, {
            method: 'DELETE',
        });
    }

    // Utility methods
    storeAuthData(token: string, user: User): void {
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
    }

    clearAuthData(): void {
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    }

    getStoredUser(): User | null {
        const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
        return userData ? JSON.parse(userData) : null;
    }

    isAuthenticated(): boolean {
        return !!this.getAuthToken();
    }
}

export const apiService = new ApiService();
export default apiService;