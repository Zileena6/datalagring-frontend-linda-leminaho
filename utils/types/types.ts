export type ParticipantRole = 'Student' | 'Instructor';
export type CourseType = 'BC' | 'AC';
export type CourseTypeName = 'Basic Course' | 'Advanced Course';

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
  courseType: CourseType;
  courseTypeName: CourseTypeName;
  courseName: string;
  courseDescription: string;
  rowVersion: string;
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
  location: Location;
  startDate: string;
  endDate: string;
  capacity: number;
  instructors: Participant[];
  approvedEnrollmentsCount: number;
  rowVersion: string;
};
