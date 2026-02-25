'use client';

import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import CDialog from '@/components/dialog/CDialog';
import { buildCourseCreate } from '@/components/forms/fieldBuilders';
import { courseService } from '@/utils/action';

import type {
  CreateCourseDTO,
  CreateCourseFormValues,
} from '@/utils/types/dto';

type Props = {
  trigger: React.ReactNode;
};

const CreateCourseDialog = ({ trigger }: Props) => {
  const queryClient = useQueryClient();
  const { fields, initialValues } = buildCourseCreate();

  const createMutation = useMutation({
    mutationFn: (dto: CreateCourseDTO) => courseService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });

  return (
    <CDialog<CreateCourseFormValues>
      title='New course'
      description='Fill in the course details and click save.'
      trigger={trigger}
      fields={fields}
      initialValues={initialValues}
      onSave={async (values) => {
        const dto: CreateCourseDTO = {
          courseCode: values.courseCode.trim(),
          courseName: values.courseName.trim(),
          description: values.description.trim(),
        };

        await createMutation.mutateAsync(dto);
      }}
    />
  );
};

export default CreateCourseDialog;
