'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import CDialog from '@/components/dialog/CDialog';
import { buildCourseInstanceEdit } from '@/components/forms/fieldBuilders';

import {
  participantService,
  courseService,
  locationService,
  courseInstanceService,
} from '@/utils/action';

import type {
  UpdateCourseInstanceDTO,
  UpdateCourseInstanceFormValues,
} from '@/utils/types/dto';
import type { CourseInstance } from '@/utils/types/types';

const EditCourseInstanceDialog = ({
  instance,
}: {
  instance: CourseInstance;
}) => {
  const queryClient = useQueryClient();

  const { data: courses = [] } = useQuery({
    queryKey: ['courses'],
    queryFn: ({ signal }) => courseService.getAll(signal),
  });

  const { data: locations = [] } = useQuery({
    queryKey: ['locations'],
    queryFn: ({ signal }) => locationService.getAll(signal),
  });

  const { data: instructors = [] } = useQuery({
    queryKey: ['participants', 'instructors'],
    queryFn: ({ signal }) => participantService.getAllInstructors(signal),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateCourseInstanceDTO }) =>
      courseInstanceService.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courseInstances'] });
    },
  });

  const { fields, initialValues } = buildCourseInstanceEdit(
    instance,
    courses,
    locations,
    instructors,
  );

  return (
    <CDialog<UpdateCourseInstanceFormValues>
      title='Edit course instance'
      description='Update the instance and click save.'
      fields={fields}
      initialValues={initialValues}
      onSave={async (values) => {
        const capacity = Number(values.capacity);
        if (!Number.isFinite(capacity) || capacity <= 0) {
          throw new Error('Capacity must be a positive number');
        }

        const instructorIds = values.instructorIds
          ? values.instructorIds
              .split(',')
              .map((x) => x.trim())
              .filter(Boolean)
          : [];

        const dto: UpdateCourseInstanceDTO = {
          rowVersion: values.rowVersion,

          // ✅ BACKEND VILL HA ID:n
          courseId: values.courseId,
          locationId: values.locationId,

          // ✅ optional i backend, men vi skickar dem ändå
          startDate: new Date(values.startDate).toISOString(),
          endDate: new Date(values.endDate).toISOString(),

          capacity,
          instructorIds,
        };

        await updateMutation.mutateAsync({ id: values.id, dto });
      }}
    />
  );
};

export default EditCourseInstanceDialog;
