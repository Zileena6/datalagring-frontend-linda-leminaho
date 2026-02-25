'use client';

import React from 'react';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';

import { participantService, courseInstanceService } from '@/utils/action';
import type { CourseInstance } from '@/utils/types/types';

type Props = {
  instructorId: string;
  triggerText?: string;
};

const InstructorInfoDialog = ({
  instructorId,
  triggerText = 'Info',
}: Props) => {
  const [open, setOpen] = React.useState(false);

  const {
    data: instructor,
    isPending: isInstructorPending,
    isError: isInstructorError,
    error: instructorError,
  } = useQuery({
    queryKey: ['participants', instructorId],
    queryFn: () => participantService.getById(instructorId),
    enabled: open,
  });

  const {
    data: instances = [],
    isPending: isInstancesPending,
    isError: isInstancesError,
    error: instancesError,
  } = useQuery({
    queryKey: ['courseInstances'],
    queryFn: ({ signal }) => courseInstanceService.getAll(signal),
    enabled: open,
  });

  const instructorInstances = React.useMemo(() => {
    return (instances as CourseInstance[]).filter((s) =>
      s.instructors?.some((i) => i.id === instructorId),
    );
  }, [instances, instructorId]);

  const fullName = instructor
    ? `${instructor.firstName} ${instructor.lastName}`
    : '';

  const competences = instructor?.competences ?? [];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline'>{triggerText}</Button>
      </DialogTrigger>

      <DialogContent className='sm:max-w-187.5'>
        <DialogHeader>
          <DialogTitle>Instructor details</DialogTitle>
          <DialogDescription>
            Personal info, competences and course instances.
          </DialogDescription>
        </DialogHeader>

        <div className='grid gap-4'>
          {isInstructorPending ? <div>Loading instructor...</div> : null}

          {isInstructorError ? (
            <div>
              Error:{' '}
              {instructorError instanceof Error
                ? instructorError.message
                : 'Unknown error'}
            </div>
          ) : null}

          {!isInstructorPending && !isInstructorError && instructor ? (
            <div className='rounded-md border p-4 grid gap-2'>
              <div className='text-base font-semibold'>{fullName}</div>

              <div className='text-sm opacity-80'>
                Email:{' '}
                <span className='font-medium opacity-100'>
                  {instructor.email}
                </span>
              </div>

              <div className='text-sm opacity-80'>
                Phone:{' '}
                <span className='font-medium opacity-100'>
                  {instructor.phoneNumber ?? '-'}
                </span>
              </div>

              <div className='text-sm opacity-80'>
                Role:{' '}
                <span className='font-medium opacity-100'>
                  {String(instructor.role)}
                </span>
              </div>

              <div className='text-sm opacity-80'>
                Created:{' '}
                <span className='font-medium opacity-100'>
                  {new Date(instructor.createdAt).toLocaleString('sv-SE')}
                </span>
              </div>
            </div>
          ) : null}

          <div className='rounded-md border p-4'>
            <div className='font-semibold mb-2'>Competences</div>

            {!instructor ? (
              <div className='text-sm opacity-70'>—</div>
            ) : competences.length === 0 ? (
              <div className='text-sm opacity-70'>No competences</div>
            ) : (
              <ul className='list-disc pl-5 grid gap-1'>
                {competences.map((c) => (
                  <li key={c.id} className='text-sm'>
                    {c.competenceName}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className='rounded-md border p-4'>
            <div className='font-semibold mb-2'>Course instances</div>

            {isInstancesPending ? <div>Loading course instances...</div> : null}

            {isInstancesError ? (
              <div>
                Error:{' '}
                {instancesError instanceof Error
                  ? instancesError.message
                  : 'Unknown error'}
              </div>
            ) : null}

            {!isInstancesPending && !isInstancesError ? (
              instructorInstances.length === 0 ? (
                <div className='text-sm opacity-70'>
                  No course instances linked to this instructor
                </div>
              ) : (
                <div className='grid gap-2'>
                  {instructorInstances.map((s) => (
                    <div key={s.id} className='rounded-md border p-3 text-sm'>
                      <div className='font-medium'>
                        {s.course.courseName} • {s.courseCode}
                      </div>
                      <div className='opacity-80'>
                        {new Date(s.startDate).toLocaleString('sv-SE')} →{' '}
                        {new Date(s.endDate).toLocaleString('sv-SE')}
                      </div>
                      <div className='opacity-80'>
                        Location: {s.location.locationName} • Capacity:{' '}
                        {s.capacity}
                      </div>
                      <div className='mt-2'>
                        <Link
                          className='underline text-sm '
                          href={`/courseInstances/${s.id}`}
                        >
                          View instance
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InstructorInfoDialog;
