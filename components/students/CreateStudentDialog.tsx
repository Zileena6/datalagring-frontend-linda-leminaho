'use client';

import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import CDialog from '@/components/dialog/CDialog';
import CButton from '@/components/Button/CButton';

import { buildStudentCreate } from '@/components/forms/fieldBuilders';
import { participantService } from '@/utils/action';

import type {
  CreateParticipantDTO,
  CreateStudentFormValues,
} from '@/utils/types/dto';

const CreateStudentDialog = () => {
  const queryClient = useQueryClient();
  const { fields, initialValues } = buildStudentCreate();

  const createMutation = useMutation({
    mutationFn: (dto: CreateParticipantDTO) => participantService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['participants', 'students'] });
    },
  });

  return (
    <CDialog<CreateStudentFormValues>
      title='New student'
      description='Fill in the student details and click save.'
      trigger={<CButton>New Student</CButton>}
      fields={fields}
      initialValues={initialValues}
      onSave={async (values) => {
        const dto: CreateParticipantDTO = {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          phoneNumber: values.phoneNumber.trim() ? values.phoneNumber : null,

          role: 'Student',
        };

        await createMutation.mutateAsync(dto);
      }}
    />
  );
};

export default CreateStudentDialog;
