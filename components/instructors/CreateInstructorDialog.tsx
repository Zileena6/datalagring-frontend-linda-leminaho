'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import CDialog from '@/components/dialog/CDialog';
import CButton from '@/components/Button/CButton';

import { buildInstructorCreate } from '@/components/forms/fieldBuilders';
import { participantService } from '@/utils/action';

import type {
  CreateParticipantDTO,
  CreateInstructorFormValues,
} from '@/utils/types/dto';

const CreateInstructorDialog = () => {
  const queryClient = useQueryClient();
  const { fields, initialValues } = buildInstructorCreate();

  const createMutation = useMutation({
    mutationFn: (dto: CreateParticipantDTO) => participantService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['participants', 'instructors'],
      });
    },
  });

  return (
    <CDialog<CreateInstructorFormValues>
      title='New instructor'
      description='Fill in the instructor details and click save.'
      trigger={<CButton>New Instructor</CButton>}
      fields={fields}
      initialValues={initialValues}
      onSave={async (values) => {
        const dto: CreateParticipantDTO = {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          phoneNumber: values.phoneNumber.trim() ? values.phoneNumber : null,

          role: 'Instructor',
        };

        await createMutation.mutateAsync(dto);
      }}
    />
  );
};

export default CreateInstructorDialog;
