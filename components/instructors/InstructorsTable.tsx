'use client';

import { participantService } from '@/utils/action';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Trash2 } from 'lucide-react';

import CDialog from '@/components/dialog/CDialog';
import { buildParticipantEdit } from '@/components/forms/fieldBuilders';

import type {
  UpdateParticipantDTO,
  UpdateParticipantFormValues,
} from '@/utils/types/dto';
import CreateInstructorDialog from './CreateInstructorDialog';
import { toast } from 'sonner';
import AddCompetenceDialog from './AddCompetenceDialog';
import InstructorInfoDialog from './InstructorInfoDialog';

const InstructorsTable = () => {
  const queryClient = useQueryClient();

  const {
    data: instructors = [],
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ['participants', 'instructors'],
    queryFn: ({ signal }) => participantService.getAllInstructors(signal),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateParticipantDTO }) =>
      participantService.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['participants', 'instructors'],
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => participantService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['participants', 'instructors'],
      });
    },
  });

  const isAbort = error instanceof DOMException && error.name === 'AbortError';

  if (isPending) return <div>Loading...</div>;
  if (isAbort) return null;

  if (isError)
    return (
      <div>
        Error: {error instanceof Error ? error.message : 'Unknown error'},
      </div>
    );

  return (
    <>
      <Table>
        <TableCaption>Instructors</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Firstname</TableHead>
            <TableHead>Lastname</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone Number</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {instructors.map((instructor) => {
            const { fields, initialValues } = buildParticipantEdit(instructor);

            return (
              <TableRow key={instructor.id}>
                <TableCell>
                  <Link href={`/participants/${instructor.id}`}>
                    {instructor.firstName}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/participants/${instructor.id}`}>
                    {instructor.lastName}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/participants/${instructor.id}`}>
                    {instructor.email}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/participants/${instructor.id}`}>
                    {instructor.phoneNumber}
                  </Link>
                </TableCell>

                <TableCell className='flex gap-2'>
                  <Trash2
                    className='cursor-pointer'
                    onClick={async () => {
                      const ok = window.confirm('Delete this instructor?');
                      if (!ok) return;

                      await toast.promise(
                        deleteMutation.mutateAsync(instructor.id),
                        {
                          loading: 'Deleting...',
                          success: 'Instructor deleted',
                          error: (e) =>
                            e instanceof Error ? e.message : 'Failed to delete',
                        },
                      );
                    }}
                  />

                  <CDialog<UpdateParticipantFormValues>
                    title='Edit instructor'
                    description="Make changes to the instructor, and click save when you're done."
                    fields={fields}
                    initialValues={initialValues}
                    onSave={(values) => {
                      const dto: UpdateParticipantDTO = {
                        rowVersion: values.rowVersion,
                        firstName: values.firstName,
                        lastName: values.lastName,
                        email: values.email,
                        phoneNumber: values.phoneNumber.trim()
                          ? values.phoneNumber
                          : null,
                      };

                      updateMutation.mutate({ id: values.id, dto });
                    }}
                  />
                  <AddCompetenceDialog
                    instructorId={instructor.id}
                    rowVersion={instructor.rowVersion}
                  />
                  <InstructorInfoDialog
                    instructorId={instructor.id}
                    triggerText='View'
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <div className='w-full flex justify-end px-4'>
        <CreateInstructorDialog />
      </div>

      {updateMutation.isError ? (
        <div className='mt-4'>
          Error:{' '}
          {updateMutation.error instanceof Error
            ? updateMutation.error.message
            : 'Unknown error'}
        </div>
      ) : null}
    </>
  );
};

export default InstructorsTable;
