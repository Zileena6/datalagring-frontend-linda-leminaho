export type ParticipantRole = 'Student' | 'Instructor';
export type CourseType = 'BC' | 'AC';
export type CourseTypeName = 'Basic Course' | 'Advanced Course';
export type EnrollmentStatus = 'Pending' | 'Confirmed' | 'Cancelled';

export type Competence = {
  id: string;
  competenceName: string;
  rowVersion: string;
  instructors?: Participant[];
};

export type Participant = {
  $type: string;
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string | null;
  role: ParticipantRole;
  rowVersion: string;
  competences?: Competence[];
  createdAt: string;
};

export type Course = {
  id: string;
  courseCode: string;
  courseName: string;
  description: string;
  rowVersion: string;
  courseType: string;
  courseTypeName: string;
};

export type Location = {
  id: string;
  locationName: string;
  rowVersion: string;
};

export type Instructor = Pick<Participant, 'id' | 'firstName' | 'lastName'>;

export type CourseInstance = {
  id: string;
  course: Course;
  courseCode: string;
  startDate: string;
  endDate: string;
  capacity: number;
  location: Location;
  instructors: Participant[];
  confirmedEnrollmentsCount: number;
  rowVersion: string;
};

export type UpdateParticipantDTO = {
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  rowVersion: string;
};

export type Enrollment = {
  id: string;
  studentId: string;
  studentName: string;
  status: EnrollmentStatus;
  enrolledAt: string;
};
