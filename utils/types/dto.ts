import { ParticipantRole, CourseType } from './types';

export type UpdateParticipantDTO = {
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  rowVersion: string;
};

export type UpdateParticipantFormValues = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  rowVersion: string;
};

export type CreateParticipantDTO = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string | null;
  role: ParticipantRole;
};

export type CreateStudentFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
};

export type CreateInstructorFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
};

export type UpdateLocationDTO = {
  locationName?: string | null;
  rowVersion: string;
};

export type UpdateLocationFormValues = {
  id: string;
  locationName: string;
  rowVersion: string;
};

export type CreateLocationDTO = {
  locationName: string;
};

export type CreateLocationFormValues = {
  locationName: string;
};

export type UpdateCourseDTO = {
  courseCode?: string | null;
  courseName?: string | null;
  description?: string | null;
  courseType?: CourseType | null;
  rowVersion: string;
};

export type UpdateCourseFormValues = {
  id: string;
  rowVersion: string;
  courseCode: string;
  courseName: string;
  description: string;
  courseType: CourseType;
  courseTypeName: string;
};

export type CreateCourseDTO = {
  courseName: string;
  description: string;
  courseType: CourseType;
};

export type CreateCourseFormValues = {
  courseName: string;
  description: string;
  courseType: CourseType | '';
};

export type CreateCourseInstanceDTO = {
  startDate: string;
  endDate: string;
  capacity: number;
  courseCode: string;
  locationName: string;
  instructorIds: string[];
};

export type CreateCourseInstanceFormValues = {
  startDate: string;
  endDate: string;
  capacity: string;
  courseCode: string;
  locationName: string;
  instructorIds: string;
};

export type UpdateCourseInstanceDTO = {
  startDate?: string | null;
  endDate?: string | null;
  locationId?: string | null;
  capacity?: number | null;
  rowVersion: string;

  courseId?: string | null;
  instructorIds?: string[] | null;
};

export type UpdateCourseInstanceFormValues = {
  id: string;
  courseId: string;
  startDate: string;
  endDate: string;
  capacity: string;
  locationId: string;
  rowVersion: string;
  instructorIds: string;
};
