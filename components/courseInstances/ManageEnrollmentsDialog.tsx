'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { courseInstanceService } from '@/utils/action';
import type { Enrollment, EnrollmentStatus } from '@/utils/types/types';
import type { UpdateEnrollmentStatusDTO } from '@/utils/types/dto';
import { toast } from 'sonner';

type Props = {
  courseInstanceId: string;
  rowVersion: string; // Instance rowVersion
};

const ManageEnrollmentsDialog = ({ courseInstanceId, rowVersion }: Props) => {
  const [open, setOpen] = React.useState(false);
  const queryClient = useQueryClient();

  const enrollmentsQueryKey = [
    'courseInstances',
    courseInstanceId,
    'enrollments',
  ] as const;

  const {
    data: enrollments = [],
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: enrollmentsQueryKey,
    queryFn: ({ signal }) =>
      courseInstanceService.getEnrollments(courseInstanceId, signal),
    enabled: open,
  });

  const statusMutation = useMutation({
    mutationFn: async (p: { studentId: string; status: EnrollmentStatus }) => {
      const dto: UpdateEnrollmentStatusDTO = {
        newStatus: p.status,
        rowVersion,
      };

      await courseInstanceService.setEnrollmentStatus(
        courseInstanceId,
        p.studentId,
        dto,
      );
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['courseInstances'] });
      await queryClient.invalidateQueries({ queryKey: enrollmentsQueryKey });
    },
  });

  const setStatus = async (studentId: string, status: EnrollmentStatus) => {
    const verb = status === 'Confirmed' ? 'Confirming' : 'Cancelling';
    const done =
      status === 'Confirmed' ? 'Student Confirmed' : 'Student cancelled';

    await toast.promise(statusMutation.mutateAsync({ studentId, status }), {
      loading: `${verb}...`,
      success: done,
      error: (e) => (e instanceof Error ? e.message : 'Something went wrong'),
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className='bg-foreground text-accent-foreground hover:bg-muted hover:text-muted-foreground cursor-pointer'
          variant='outline'
        >
          Enrollments
        </Button>
      </DialogTrigger>

      <DialogContent className='sm:max-w-160'>
        <DialogHeader>
          <DialogTitle>Manage Enrollments</DialogTitle>
          <DialogDescription>
            Confirm or Cancel students for this course instance.
          </DialogDescription>
        </DialogHeader>

        <div className='grid gap-3 text-muted-foreground'>
          {isPending ? <div>Loading...</div> : null}

          {isError ? (
            <div>
              Error: {error instanceof Error ? error.message : 'Unknown error'}
            </div>
          ) : null}

          {!isPending && !isError && enrollments.length === 0 ? (
            <div>No enrollments</div>
          ) : null}

          {!isPending && !isError
            ? enrollments.map((e: Enrollment) => (
                <div
                  key={e.id}
                  className='flex items-center justify-between gap-4 rounded-md border p-3'
                >
                  <div className='min-w-0'>
                    <div className='text-sm font-medium truncate'>
                      {e.studentName}
                    </div>
                    <div className='text-xs opacity-70'>
                      Status: {e.status} •{' '}
                      {new Date(e.enrolledAt).toLocaleString('sv-SE')}
                    </div>
                  </div>

                  <div className='flex gap-2'>
                    <Button
                      variant='secondary'
                      disabled={
                        statusMutation.isPending || e.status === 'Confirmed'
                      }
                      onClick={() => setStatus(e.studentId, 'Confirmed')}
                    >
                      Approve
                    </Button>

                    <Button
                      variant='destructive'
                      disabled={
                        statusMutation.isPending || e.status === 'Cancelled'
                      }
                      onClick={() => setStatus(e.studentId, 'Cancelled')}
                    >
                      Deny
                    </Button>
                  </div>
                </div>
              ))
            : null}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ManageEnrollmentsDialog;
