import { ParticipantRole, EnrollmentStatus } from './types';

// MARK: Participants
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

// MARK: Competences
export type CreateCompetenceDTO = {
  competenceName: string;
};

export type CreateCompetenceFormValues = {
  name: string;
};

export type UpdateCompetenceDTO = {
  competenceName?: string | null;
  rowVersion: string;
};

export type UpdateCompetenceFormValues = {
  id: string;
  competenceName: string;
  rowVersion: string;
};

export type AddCompetenceDTO = {
  competenceName: string;
  rowVersion: string;
};
export type AddCompetenceFormValues = {
  participantId: string;
  competenceId: string;
  rowVersion: string;
};

// MARK: Locations
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

// MARK: Courses
export type UpdateCourseDTO = {
  courseCode?: string | null;
  courseName?: string | null;
  description?: string | null;
  rowVersion: string;
};

export type UpdateCourseFormValues = {
  id: string;
  courseCode: string;
  courseName: string;
  description: string;
  rowVersion: string;
};

export type CreateCourseDTO = {
  courseCode: string;
  courseName: string;
  description: string;
};

export type CreateCourseFormValues = {
  courseName: string;
  description: string;
  courseCode: string;
};

// MARK: CourseInstances
export type CreateCourseInstanceDTO = {
  startDate: string;
  endDate: string;
  courseCode: string;
  capacity: number;
  locationId: string;

  instructorIds: string[];
};

export type CreateCourseInstanceFormValues = {
  startDate: string;
  endDate: string;
  courseCode: string;
  capacity: string;
  locationId: string;
  instructorIds: string;
};

export type UpdateCourseInstanceDTO = {
  startDate?: string | null;
  endDate?: string | null;
  capacity?: number | null;
  locationId?: string | null;
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

// MARK: Enrollments
export type EnrollStudentDTO = {
  studentId: string;
  rowVersion: string;
};

export type UpdateEnrollmentStatusDTO = {
  newStatus: EnrollmentStatus;
  rowVersion: string;
};

export type EnrollStudentToInstanceFormValues = {
  studentId: string;
  courseInstanceId: string;
  rowVersion: string;
};

export type UpdateEnrollmentStatusFormValues = {
  courseInstanceId: string;
  studentId: string;
  newStatus: EnrollmentStatus | '';
  rowVersion: string;
};
