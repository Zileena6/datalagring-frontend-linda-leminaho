import { Participant, Course, CourseInstance, Location } from './types/types';
import { ApiError, ProblemDetails } from './types/api';
import {
  mockCourse,
  mockInstances,
  mockLocation,
  mockParticipant,
} from './mock-data';
import { UpdateCourseInstanceDTO } from './types/dto';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

function mockResponse<T>(endpoint: string): T {
  if (endpoint.includes('/attendees/students')) {
    return mockParticipant.filter((a) => a.role === 'Student') as T;
  }

  if (endpoint.includes('/attendees/instructors')) {
    return mockParticipant.filter((a) => a.role === 'Instructor') as T;
  }

  if (endpoint.includes('/attendees')) {
    return mockParticipant as T;
  }

  if (endpoint.includes('/courses')) {
    return mockCourse as T;
  }

  if (endpoint.includes('/locations')) {
    return mockLocation as T;
  }

  if (endpoint.includes('/courseSessions')) {
    return mockInstances as T;
  }

  throw new Error(`No mock-data available for endpoint: ${endpoint}`);
}

async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...(options?.body ? { 'Content-Type': 'application/json' } : {}),
        ...options?.headers,
      },
      signal: options?.signal,
    });

    if (!res.ok) {
      const body = (await res
        .json()
        .catch(() => null)) as ProblemDetails | null;
      throw new ApiError(body, res.status);
    }

    if (res.status === 204) return undefined as T;

    return (await res.json()) as T;
  } catch (err) {
    const isAbort = err instanceof DOMException && err.name === 'AbortError';
    if (isAbort) throw err;

    const isNetworkError = err instanceof TypeError;

    if (USE_MOCK_DATA || isNetworkError) {
      console.warn(`API not available (${endpoint}). Using MOCK-DATA.`);
      return mockResponse<T>(endpoint);
    }

    throw err;
  }
}

export const participantService = {
  getAll: (ct?: AbortSignal) =>
    apiFetch<Participant[]>('/participants', { signal: ct }),

  getAllStudents: (ct?: AbortSignal) =>
    apiFetch<Participant[]>('/participants/students', { signal: ct }),

  getAllInstructors: (ct?: AbortSignal) =>
    apiFetch<Participant[]>('/participants/instructors', { signal: ct }),

  getById: (id: string) => apiFetch<Participant>(`/participants/${id}`),

  search: (searchTerm: string, ct?: AbortSignal) =>
    apiFetch<Participant[]>(`/participants/search?searchTerm=${searchTerm}`, {
      signal: ct,
    }),

  create: (data: unknown) =>
    apiFetch<Participant>('/participants', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: unknown) =>
    apiFetch<Participant>(`/participants/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};

export const courseService = {
  getAll: (ct?: AbortSignal) => apiFetch<Course[]>('/courses', { signal: ct }),

  create: (data: unknown) =>
    apiFetch<Course>('/courses', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: unknown) =>
    apiFetch<Course>(`/courses/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};

export const locationService = {
  getAll: (ct?: AbortSignal) =>
    apiFetch<Location[]>('/locations', { signal: ct }),

  create: (data: unknown) =>
    apiFetch<Location>('/locations', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: unknown) =>
    apiFetch<Location>(`/locations/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};

export const courseInstanceService = {
  getAll: (ct?: AbortSignal) =>
    apiFetch<CourseInstance[]>('/courseInstances', { signal: ct }),

  create: (data: unknown) =>
    apiFetch('/courseSessions', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: UpdateCourseInstanceDTO) =>
    apiFetch<CourseInstance>(`/courseInstances/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};
