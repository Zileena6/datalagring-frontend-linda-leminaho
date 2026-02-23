'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';

import CDialog from '@/components/dialog/CDialog';
import { buildEnrollStudentToInstance } from '@/components/forms/fieldBuilders';

import { courseInstanceService } from '@/utils/action';
import type { CourseInstance } from '@/utils/types/types';
import type {
  EnrollStudentDTO,
  EnrollStudentToInstanceFormValues,
} from '@/utils/types/dto';
import { toast } from 'sonner';

const EnrollStudentToInstanceDialog = ({
  studentId,
}: {
  studentId: string;
}) => {
  const queryClient = useQueryClient();

  const { data: instances = [] } = useQuery({
    queryKey: ['courseInstances'],
    queryFn: ({ signal }) => courseInstanceService.getAll(signal),
  });

  const { fields, initialValues } = buildEnrollStudentToInstance(
    studentId,
    instances,
  );

  const enrollMutation = useMutation({
    mutationFn: (p: { courseInstanceId: string; dto: EnrollStudentDTO }) =>
      courseInstanceService.enrollStudent(p.courseInstanceId, p.dto),

    onSuccess: () => {
      toast.success('Student enrolled');
      queryClient.invalidateQueries({ queryKey: ['courseInstances'] });
    },

    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'Failed to enroll');
    },
  });

  return (
    <>
      <CDialog<EnrollStudentToInstanceFormValues>
        title='Enroll student'
        description='Select a course instance and click save.'
        trigger={<Button>Enroll</Button>}
        fields={fields}
        initialValues={initialValues}
        onSave={async (values) => {
          const instance = instances.find(
            (s: CourseInstance) => s.id === values.courseInstanceId,
          );
          if (!instance) throw new Error('Invalid course instance');

          const dto: EnrollStudentDTO = {
            studentId: values.studentId,
            rowVersion: instance.rowVersion,
          };

          toast.promise(
            enrollMutation.mutateAsync({
              courseInstanceId: values.courseInstanceId,
              dto,
            }),
            {
              loading: 'Enrolling...',
              success: 'Student enrolled',
              error: (e) =>
                e instanceof Error ? e.message : 'Failed to enroll',
            },
          );
        }}
      />
    </>
  );
};

export default EnrollStudentToInstanceDialog;
