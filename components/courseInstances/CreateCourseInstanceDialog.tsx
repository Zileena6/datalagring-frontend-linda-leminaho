'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';

import CDialog from '@/components/dialog/CDialog';
import { buildCourseInstanceCreate } from '@/components/forms/fieldBuilders';

import {
  participantService,
  courseService,
  locationService,
  courseInstanceService,
} from '@/utils/action';
import type {
  CreateCourseInstanceDTO,
  CreateCourseInstanceFormValues,
} from '@/utils/types/dto';

const CreateCourseInstanceDialog = ({
  triggerText = 'New Course Instance',
}: {
  triggerText?: string;
}) => {
  const queryClient = useQueryClient();

  const { data: courses = [], isPending: coursesPending } = useQuery({
    queryKey: ['courses'],
    queryFn: ({ signal }) => courseService.getAll(signal),
  });

  const { data: locations = [], isPending: locationsPending } = useQuery({
    queryKey: ['locations'],
    queryFn: ({ signal }) => locationService.getAll(signal),
  });

  const { data: instructors = [], isPending: instructorsPending } = useQuery({
    queryKey: ['participants', 'instructors'],
    queryFn: ({ signal }) => participantService.getAllInstructors(signal),
  });

  const createMutation = useMutation({
    mutationFn: (dto: CreateCourseInstanceDTO) =>
      courseInstanceService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courseInstances'] });
    },
  });

  const loading = coursesPending || locationsPending || instructorsPending;

  const { fields, initialValues } = buildCourseInstanceCreate(
    courses,
    locations,
    instructors,
  );

  return (
    <CDialog<CreateCourseInstanceFormValues>
      title='New course instance'
      description='Pick existing course/location/instructors, set dates and capacity.'
      trigger={
        <Button
          className='bg-foreground text-accent-foreground hover:bg-muted hover:text-muted-foreground cursor-pointer'
          disabled={loading}
        >
          {loading ? 'Loading…' : triggerText}
        </Button>
      }
      fields={fields}
      initialValues={initialValues}
      onSave={async (values) => {
        if (!values.courseCode) throw new Error('Select a course');
        if (!values.locationId) throw new Error('Select a location');
        if (!values.startDate) throw new Error('Select a start date');
        if (!values.endDate) throw new Error('Select an end date');

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

        const dto: CreateCourseInstanceDTO = {
          courseCode: values.courseCode,
          locationId: values.locationId,
          startDate: new Date(values.startDate).toISOString(),
          endDate: new Date(values.endDate).toISOString(),
          capacity,
          instructorIds,
        };

        await createMutation.mutateAsync(dto);
      }}
    />
  );
};

export default CreateCourseInstanceDialog;
