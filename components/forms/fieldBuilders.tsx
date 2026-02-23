import type {
  Participant,
  Location,
  Course,
  CourseType,
  CourseInstance,
  Competence,
} from '@/utils/types/types';
import type { FormField } from './DynamicForm';
import type {
  UpdateParticipantFormValues,
  UpdateLocationFormValues,
  UpdateCourseFormValues,
  CreateCourseFormValues,
  CreateCourseInstanceFormValues,
  UpdateCourseInstanceFormValues,
  CreateLocationFormValues,
  CreateStudentFormValues,
  AddCompetenceFormValues,
  UpdateCompetenceFormValues,
  CreateCompetenceFormValues,
  EnrollStudentToInstanceFormValues,
} from '@/utils/types/dto';
import { faker } from '@faker-js/faker';

// MARK: Participant
const buildParticipantEdit = (
  a: Participant,
): {
  fields: Array<FormField<Extract<keyof UpdateParticipantFormValues, string>>>;
  initialValues: UpdateParticipantFormValues;
} => {
  const fields: Array<
    FormField<Extract<keyof UpdateParticipantFormValues, string>>
  > = [
    { name: 'id', kind: 'hidden' },
    { name: 'rowVersion', kind: 'hidden' },

    { name: 'firstName', label: 'Firstname', required: true },
    { name: 'lastName', label: 'Lastname', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'phoneNumber', label: 'Phone Number', type: 'tel' },
  ];

  const initialValues: UpdateParticipantFormValues = {
    id: a.id,
    rowVersion: a.rowVersion,
    firstName: a.firstName,
    lastName: a.lastName,
    email: a.email ?? '',
    phoneNumber: a.phoneNumber ?? '',
  };

  return { fields, initialValues };
};

const buildStudentCreate = (): {
  fields: Array<FormField<Extract<keyof CreateStudentFormValues, string>>>;
  initialValues: CreateStudentFormValues;
  generateMockValues: () => CreateStudentFormValues;
} => {
  const fields: Array<
    FormField<Extract<keyof CreateStudentFormValues, string>>
  > = [
    { name: 'firstName', label: 'Firstname', required: true },
    { name: 'lastName', label: 'Lastname', required: true },
    { name: 'email', label: 'Email', required: true },
    { name: 'phoneNumber', label: 'Phone Number' },
  ];

  const initialValues: CreateStudentFormValues = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
  };

  const generateMockValues = (): CreateStudentFormValues => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    return {
      firstName,
      lastName,
      // Genererar email baserat på de slumpade namnen för extra realism
      email: faker.internet.email({ firstName, lastName }).toLowerCase(),
      phoneNumber: faker.phone.number({ style: 'international' }),
    };
  };

  return { fields, initialValues, generateMockValues };
};

const buildInstructorCreate = (): {
  fields: Array<FormField<Extract<keyof CreateStudentFormValues, string>>>;
  initialValues: CreateStudentFormValues;
} => {
  const fields: Array<
    FormField<Extract<keyof CreateStudentFormValues, string>>
  > = [
    { name: 'firstName', label: 'Firstname', required: true },
    { name: 'lastName', label: 'Lastname', required: true },
    { name: 'email', label: 'Email', required: true },
    { name: 'phoneNumber', label: 'Phone Number' },
  ];

  const initialValues: CreateStudentFormValues = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
  };

  return { fields, initialValues };
};

// MARK: Competence
const buildCompetenceCreate = (): {
  fields: Array<FormField<Extract<keyof CreateCompetenceFormValues, string>>>;
  initialValues: CreateCompetenceFormValues;
} => {
  const fields: Array<
    FormField<Extract<keyof CreateCompetenceFormValues, string>>
  > = [{ name: 'name', label: 'Competence name', required: true }];

  const initialValues: CreateCompetenceFormValues = {
    name: '',
  };

  return { fields, initialValues };
};

const buildCompetenceEdit = (
  c: Competence,
): {
  fields: Array<FormField<Extract<keyof UpdateCompetenceFormValues, string>>>;
  initialValues: UpdateCompetenceFormValues;
} => {
  const fields: Array<
    FormField<Extract<keyof UpdateCompetenceFormValues, string>>
  > = [
    { name: 'id', kind: 'hidden' },
    { name: 'rowVersion', kind: 'hidden' },
    { name: 'name', label: 'Competence name', required: true },
  ];

  const initialValues: UpdateCompetenceFormValues = {
    id: c.id,
    rowVersion: c.rowVersion,
    name: c.competenceName ?? '',
  };

  return { fields, initialValues };
};

const buildAddCompetenceToInstructor = (
  instructorId: string,
  rowVersion: string,
  competences: Competence[],
): {
  fields: Array<
    FormField<Extract<keyof AddCompetenceFormValues, string>, string>
  >;
  initialValues: AddCompetenceFormValues;
} => {
  const fields: Array<
    FormField<Extract<keyof AddCompetenceFormValues, string>, string>
  > = [
    { name: 'instructorId', kind: 'hidden' },
    { name: 'rowVersion', kind: 'hidden' },

    {
      kind: 'select',
      name: 'competenceName',
      label: 'Competence',
      required: true,
      placeholderOption: 'Select competence...',
      options: competences.map((c) => ({
        label: c.competenceName,
        value: c.competenceName,
      })),
    },
  ];

  const initialValues: AddCompetenceFormValues = {
    instructorId,
    rowVersion,
    competenceName: '',
  };

  return { fields, initialValues };
};

// MARK: Location
const buildLocationEdit = (
  l: Location,
): {
  fields: Array<FormField<Extract<keyof UpdateLocationFormValues, string>>>;
  initialValues: UpdateLocationFormValues;
} => {
  const fields: Array<
    FormField<Extract<keyof UpdateLocationFormValues, string>>
  > = [
    { name: 'id', kind: 'hidden' },
    { name: 'rowVersion', kind: 'hidden' },
    { name: 'locationName', label: 'City', required: true },
  ];

  const initialValues: UpdateLocationFormValues = {
    id: l.id,
    rowVersion: l.rowVersion,
    locationName: l.locationName,
  };

  return { fields, initialValues };
};

const buildLocationCreate = (): {
  fields: Array<FormField<Extract<keyof CreateLocationFormValues, string>>>;
  initialValues: CreateLocationFormValues;
} => {
  const fields: Array<
    FormField<Extract<keyof CreateLocationFormValues, string>>
  > = [{ name: 'locationName', label: 'City', required: true }];

  const initialValues: CreateLocationFormValues = {
    locationName: '',
  };

  return { fields, initialValues };
};

// MARK: Course
const buildCourseEdit = (
  c: Course,
): {
  fields: Array<FormField<Extract<keyof UpdateCourseFormValues, string>>>;
  initialValues: UpdateCourseFormValues;
} => {
  const fields: Array<
    FormField<Extract<keyof UpdateCourseFormValues, string>>
  > = [
    { name: 'id', kind: 'hidden' },
    { name: 'rowVersion', kind: 'hidden' },

    { name: 'courseName', label: 'Course', required: true },
    { name: 'courseCode', label: 'Course Code', required: true },

    { name: 'courseType', label: 'Course Type', required: true },

    { name: 'courseTypeName', label: 'Course Type Name', readOnly: true },

    { name: 'description', label: 'Course Description' },
  ];

  const initialValues: UpdateCourseFormValues = {
    id: c.id,
    rowVersion: c.rowVersion,
    courseName: c.courseName,
    courseCode: c.courseCode,
    description: c.description,
    courseType: c.courseType as CourseType,
    courseTypeName: c.courseTypeName,
  };

  return { fields, initialValues };
};

const COURSE_TYPE_OPTIONS: Array<{ label: string; value: CourseType }> = [
  { label: 'Basic', value: 'BC' },
  { label: 'Advanced', value: 'AC' },
];

const buildCourseCreate = (): {
  fields: Array<
    FormField<Extract<keyof CreateCourseFormValues, string>, string>
  >;
  initialValues: CreateCourseFormValues;
} => {
  const fields: Array<
    FormField<Extract<keyof CreateCourseFormValues, string>, string>
  > = [
    { name: 'courseName', label: 'Course Name', required: true },

    {
      kind: 'select',
      name: 'courseType',
      label: 'Course Type',
      required: true,
      placeholderOption: 'Select course type...',
      options: COURSE_TYPE_OPTIONS,
    },

    {
      kind: 'textarea',
      name: 'description',
      label: 'Course Description',
      rows: 5,
    },
  ];

  const initialValues: CreateCourseFormValues = {
    courseName: '',
    courseType: '',
    description: '',
  };

  return { fields, initialValues };
};

// MARK: CourseInstance
const buildCourseInstanceCreate = (
  courses: Course[],
  locations: Location[],
  instructors: Participant[],
): {
  fields: Array<
    FormField<Extract<keyof CreateCourseInstanceFormValues, string>, string>
  >;
  initialValues: CreateCourseInstanceFormValues;
} => {
  const courseOptions = courses.map((c) => ({
    label: `${c.courseName} (${c.courseTypeName}) • ${c.courseCode}`,
    value: c.courseCode,
  }));

  const locationOptions = locations.map((l) => ({
    label: l.locationName,
    value: l.locationName,
  }));

  const instructorOptions = instructors.map((i) => ({
    label: `${i.firstName} ${i.lastName}`,
    value: i.id,
  }));

  const fields: Array<
    FormField<Extract<keyof CreateCourseInstanceFormValues, string>, string>
  > = [
    {
      kind: 'select',
      name: 'courseCode',
      label: 'Course',
      required: true,
      placeholderOption: 'Select course...',
      options: courseOptions,
    },
    {
      kind: 'select',
      name: 'locationName',
      label: 'Location',
      required: true,
      placeholderOption: 'Select location...',
      options: locationOptions,
    },
    {
      kind: 'input',
      name: 'startDate',
      label: 'Start date',
      type: 'datetime-local',
      required: true,
    },
    {
      kind: 'input',
      name: 'endDate',
      label: 'End date',
      type: 'datetime-local',
      required: true,
    },
    {
      kind: 'input',
      name: 'capacity',
      label: 'Capacity',
      type: 'number',
      required: true,
    },
    {
      kind: 'checkbox-group',
      name: 'instructorIds',
      label: 'Instructors',
      options: instructorOptions,
    },
  ];

  const initialValues: CreateCourseInstanceFormValues = {
    courseCode: '',
    locationName: '',
    startDate: '',
    endDate: '',
    capacity: '0',
    instructorIds: '',
  };

  return { fields, initialValues };
};

const toDateTimeLocal = (iso: string): string => {
  // ISO -> "YYYY-MM-DDTHH:mm" i lokal tid
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}`;
};

const buildCourseInstanceEdit = (
  Instance: CourseInstance,
  courses: Course[],
  locations: Location[],
  instructors: Participant[],
): {
  fields: Array<
    FormField<Extract<keyof UpdateCourseInstanceFormValues, string>, string>
  >;
  initialValues: UpdateCourseInstanceFormValues;
} => {
  const fields = [
    { name: 'id', kind: 'hidden' },
    { name: 'rowVersion', kind: 'hidden' },

    {
      kind: 'select',
      name: 'courseId',
      label: 'Course',
      required: true,
      options: courses.map((c) => ({
        label: `${c.courseName} (${c.courseCode})`,
        value: c.id,
      })),
    },

    {
      kind: 'select',
      name: 'locationId',
      label: 'Location',
      required: true,
      options: locations.map((l) => ({
        label: l.locationName,
        value: l.id,
      })),
    },

    {
      kind: 'input',
      name: 'startDate',
      label: 'Start date',
      type: 'datetime-local',
    },

    {
      kind: 'input',
      name: 'endDate',
      label: 'End date',
      type: 'datetime-local',
    },

    {
      kind: 'input',
      name: 'capacity',
      label: 'Capacity',
      type: 'number',
    },

    {
      kind: 'checkbox-group',
      name: 'instructorIds',
      label: 'Instructors',
      options: instructors.map((i) => ({
        label: `${i.firstName} ${i.lastName}`,
        value: i.id,
      })),
      defaultCheckedValues: Instance.instructors.map((x) => x.id),
    },
  ] satisfies Array<
    FormField<Extract<keyof UpdateCourseInstanceFormValues, string>, string>
  >;

  const initialValues: UpdateCourseInstanceFormValues = {
    id: Instance.id,
    rowVersion: Instance.rowVersion,

    courseId: Instance.course.id, // ✅ ID
    locationId: Instance.location.id, // ✅ ID

    startDate: toDateTimeLocal(Instance.startDate),
    endDate: toDateTimeLocal(Instance.endDate),

    capacity: String(Instance.capacity),

    instructorIds: '',
  };

  return { fields, initialValues };
};

const buildEnrollStudentToInstance = (
  studentId: string,
  instances: CourseInstance[],
): {
  fields: Array<
    FormField<Extract<keyof EnrollStudentToInstanceFormValues, string>, string>
  >;
  initialValues: EnrollStudentToInstanceFormValues;
} => {
  const fields: Array<
    FormField<Extract<keyof EnrollStudentToInstanceFormValues, string>, string>
  > = [
    { name: 'studentId', kind: 'hidden' },

    {
      kind: 'select',
      name: 'courseInstanceId',
      label: 'Course instance',
      required: true,
      placeholderOption: 'Select instance...',
      options: instances.map((s) => ({
        label: `${s.course.courseName} • ${s.courseCode} • ${new Date(s.startDate).toLocaleString('sv-SE')} • ${s.location.locationName}`,
        value: s.id,
      })),
    },

    { name: 'rowVersion', kind: 'hidden' },
  ];

  const initialValues: EnrollStudentToInstanceFormValues = {
    studentId,
    courseInstanceId: '',
    rowVersion: '',
  };

  return { fields, initialValues };
};

export {
  buildParticipantEdit,
  buildStudentCreate,
  buildInstructorCreate,
  buildCompetenceCreate,
  buildCompetenceEdit,
  buildAddCompetenceToInstructor,
  buildLocationEdit,
  buildLocationCreate,
  buildCourseEdit,
  buildCourseCreate,
  buildCourseInstanceEdit,
  buildCourseInstanceCreate,
  buildEnrollStudentToInstance,
};
