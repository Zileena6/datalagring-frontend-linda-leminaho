'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

import CDialog from '@/components/dialog/CDialog';
import { buildAddCompetenceToInstructor } from '@/components/forms/fieldBuilders';

import { participantService, competenceService } from '@/utils/action';
import type { Competence } from '@/utils/types/types';
import type { AddCompetenceFormValues } from '@/utils/types/dto';

type Props = {
  instructorId: string;
  rowVersion: string;
};

const AddCompetenceDialog = ({ instructorId, rowVersion }: Props) => {
  const queryClient = useQueryClient();

  const { data: competences = [] } = useQuery({
    queryKey: ['participants', 'competences'],
    queryFn: ({ signal }) => competenceService.getAll(signal),
  });

  const { fields, initialValues } = buildAddCompetenceToInstructor(
    instructorId,
    rowVersion,
    competences as Competence[],
  );

  const addMutation = useMutation({
    mutationFn: (p: { id: string; dto: AddCompetenceFormValues }) =>
      participantService.addCompetenceToInstructor(p.id, p.dto),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['participants', 'competences'],
      });
    },
  });

  return (
    <CDialog<AddCompetenceFormValues>
      title='Add competence'
      description='Select a competence and click save.'
      trigger={
        <Button
          className='bg-foreground text-accent-foreground hover:bg-muted hover:text-muted-foreground cursor-pointer'
          variant='outline'
        >
          Add competence
        </Button>
      }
      fields={fields}
      initialValues={initialValues}
      onSave={async (values) => {
        const dto: AddCompetenceFormValues = {
          participantId: values.participantId,
          competenceId: values.competenceId,
          rowVersion: values.rowVersion,
        };

        toast.promise(
          addMutation.mutateAsync({ id: values.participantId, dto }),
          {
            loading: 'Adding competence...',
            success: 'Competence added',
            error: (e) =>
              e instanceof Error ? e.message : 'Failed to add competence',
          },
        );
      }}
    />
  );
};

export default AddCompetenceDialog;
