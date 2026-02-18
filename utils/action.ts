import { Participant, Course, CourseInstance, Location } from './types/types';
import { ApiError } from './types/api';
import {
  mockCourse,
  mockInstances,
  mockLocation,
  mockParticipant,
} from './mock-data';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

async function fetcher<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const errorBody: ApiError = await response.json().catch(() => ({}));
      throw new Error(errorBody.message || `API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    const isAbortError =
      error instanceof DOMException && error.name === 'AbortError';

    if (isAbortError) {
      throw error;
    }

    const isNetworkError = error instanceof TypeError;

    if (isNetworkError || USE_MOCK_DATA) {
      console.warn(
        `API is not available (${endpoint}). Using MOCK-DATA instead.`,
      );

      if (endpoint.includes('/participants')) {
        return mockParticipant as T;
      }

      if (endpoint.includes('/participants/students')) {
        return mockParticipant.filter((a) => a.role === 'Student') as T;
      }

      if (endpoint.includes('/participants/instructors')) {
        return mockParticipant.filter((a) => a.role === 'Instructor') as T;
      }

      if (endpoint.includes('/courses')) {
        return mockCourse as T;
      }

      if (endpoint.includes('/courseInstances')) {
        return mockInstances as T;
      }

      if (endpoint.includes('/locations')) {
        return mockLocation as T;
      }

      throw new Error(`No mock-data available on ${endpoint}`);
    }

    throw error;
  }
}

export const participantService = {
  getAll: (ct?: AbortSignal) =>
    fetcher<Participant[]>('/participants', { signal: ct }),

  getAllStudents: (ct?: AbortSignal) =>
    fetcher<Participant[]>('/participants/students', { signal: ct }),

  getAllInstructors: (ct?: AbortSignal) =>
    fetcher<Participant[]>('/participants/instructors', { signal: ct }),

  getById: (id: string) => fetcher<Participant>(`/participants/${id}`),

  search: (searchTerm: string, ct?: AbortSignal) =>
    fetcher<Participant[]>(`/participants/search?searchTerm=${searchTerm}`, {
      signal: ct,
    }),

  create: (data: unknown) =>
    fetcher<Participant>('/participants', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

export const courseService = {
  getAll: (ct?: AbortSignal) => fetcher<Course[]>('/courses', { signal: ct }),
};

export const locationService = {
  getAll: (ct?: AbortSignal) =>
    fetcher<Location[]>('/locations', { signal: ct }),
};

export const courseInstancesService = {
  getAll: (ct?: AbortSignal) =>
    fetcher<CourseInstance[]>('/courseInstances', { signal: ct }),
};
