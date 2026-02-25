'use client';

import { courseInstanceService } from '@/utils/action';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Trash2 } from 'lucide-react';

import CreateCourseInstanceDialog from './CreateCourseInstanceDialog';
import EditCourseInstanceDialog from './EditCourseInstanceDialog';
import { toast } from 'sonner';
// import ManageEnrollmentsDialog from './ManageEnrollmentsDialog';

const CourseInstancesTable = () => {
  const queryClient = useQueryClient();

  const {
    data: courseInstances = [],
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ['courseInstances'],
    queryFn: ({ signal }) => courseInstanceService.getAll(signal),
    staleTime: 1000 * 5,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => courseInstanceService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courseInstances'] });
    },
  });

  if (isPending) return <div>Loading...</div>;

  if (isError)
    return (
      <div>
        Error: {error instanceof Error ? error.message : 'Unknown error'}
      </div>
    );

  return (
    <div>
      <Table>
        <TableCaption>Course Instances</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Course</TableHead>
            <TableHead>Course Code</TableHead>
            <TableHead>Start date</TableHead>
            <TableHead>End date</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Instructors</TableHead>
            <TableHead>Capacity</TableHead>
            {/* <TableHead>Confirmed students</TableHead> */}
            {/* <TableHead>Enrollments</TableHead> */}
            <TableHead />
          </TableRow>
        </TableHeader>

        <TableBody>
          {courseInstances.map((instance) => (
            <TableRow key={instance.id}>
              <TableCell>
                <Link href={`/courses/${instance.course.id}`}>
                  {instance.course.courseName}
                </Link>
              </TableCell>

              <TableCell>{instance.courseCode}</TableCell>

              <TableCell>
                {new Date(instance.startDate).toLocaleString('sv-SE')}
              </TableCell>

              <TableCell>
                {new Date(instance.endDate).toLocaleString('sv-SE')}
              </TableCell>

              <TableCell>{instance.location.locationName}</TableCell>

              <TableCell>
                {instance.instructors.map(({ id, firstName, lastName }) => (
                  <div key={id} className='my-1'>
                    <Link href={`/participants/${id}`}>
                      {firstName} {lastName}
                    </Link>
                  </div>
                ))}
              </TableCell>

              <TableCell>{instance.capacity}</TableCell>

              {/* <TableCell>{instance.confirmedEnrollmentsCount}</TableCell> */}

              <TableCell className='flex gap-3'>
                {/* <ManageEnrollmentsDialog
                  courseInstanceId={instance.id}
                  rowVersion={instance.rowVersion}
                /> */}
                <Trash2
                  className='cursor-pointer'
                  onClick={async () => {
                    const ok = window.confirm('Delete this courseInstance?');
                    if (!ok) return;

                    await toast.promise(
                      deleteMutation.mutateAsync(instance.id),
                      {
                        loading: 'Deleting...',
                        success: 'Student deleted',
                        error: (e) =>
                          e instanceof Error ? e.message : 'Failed to delete',
                      },
                    );
                  }}
                />

                <EditCourseInstanceDialog instance={instance} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className='flex justify-end mt-4'>
        <CreateCourseInstanceDialog triggerText='New Course Instance' />
      </div>
    </div>
  );
};

export default CourseInstancesTable;
