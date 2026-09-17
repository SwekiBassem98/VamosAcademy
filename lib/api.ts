export interface ApiResponse<T> {
  data?: T;
  error?: string;
  statusCode: number;
}

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.vamosacademy.tn/v1';

class ApiClient {
  private token: string | null = null;

  setAuthToken(token: string | null) {
    this.token = token;
  }

  getAuthToken(): string | null {
    return this.token;
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await res.json();
      if (!res.ok) {
        return {
          error: data.message || 'An error occurred during network request',
          statusCode: res.status,
        };
      }
      return { data, statusCode: res.status };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Network error';
      return { error: errorMessage, statusCode: 500 };
    }
  }

  get<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  post<T>(endpoint: string, body: unknown) {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }
}

export const apiClient = new ApiClient();
