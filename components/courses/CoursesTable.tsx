'use client';

import { courseService } from '@/utils/action';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Trash2 } from 'lucide-react';
import { Button } from '../ui/button';

import CDialog from '@/components/dialog/CDialog';
import { buildCourseEdit } from '@/components/forms/fieldBuilders';

import CreateCourseDialog from './CreateCourseDialog';
import type {
  UpdateCourseDTO,
  UpdateCourseFormValues,
} from '@/utils/types/dto';
import { toast } from 'sonner';

const CoursesTable = () => {
  const queryClient = useQueryClient();

  const {
    data: courses = [],
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ['courses'],
    queryFn: ({ signal }) => courseService.getAll(signal),
    refetchInterval: 5_000,
    refetchIntervalInBackground: true,
    staleTime: 0,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateCourseDTO }) =>
      courseService.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => courseService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });

  if (isPending) return <div>Loading</div>;

  if (isError)
    return (
      <div>
        Error: {error instanceof Error ? error.message : 'Unknown error'}
      </div>
    );

  return (
    <>
      <Table>
        <TableCaption>Courses</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Course</TableHead>
            <TableHead>Course Code</TableHead>
            <TableHead>Description</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {courses.map((course) => {
            const { fields, initialValues } = buildCourseEdit(course);

            return (
              <TableRow key={course.id}>
                <TableCell>
                  <Link href={`/courses/${course.id}`}>
                    {course.courseName}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/courses/${course.id}`}>
                    {course.courseCode}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/courses/${course.id}`}>
                    {course.description}
                  </Link>
                </TableCell>

                <TableCell className='flex gap-2'>
                  <Trash2
                    className='cursor-pointer'
                    onClick={async () => {
                      const ok = window.confirm('Delete this course?');
                      if (!ok) return;

                      await toast.promise(
                        deleteMutation.mutateAsync(course.id),
                        {
                          loading: 'Deleting...',
                          success: 'Course deleted',
                          error: (e) =>
                            e instanceof Error ? e.message : 'Failed to delete',
                        },
                      );
                    }}
                  />

                  <CDialog<UpdateCourseFormValues>
                    title='Edit course'
                    description="Edit course, and click save when you're done."
                    fields={fields}
                    initialValues={initialValues}
                    onSave={async (values) => {
                      const dto: UpdateCourseDTO = {
                        courseCode: values.courseCode,
                        courseName: values.courseName,
                        description: values.description,
                        rowVersion: values.rowVersion,
                      };

                      await updateMutation.mutateAsync({ id: values.id, dto });
                    }}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>

        <TableFooter>
          <TableRow>
            <TableCell colSpan={5} className=''>
              Click on a row to view course details
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
      <div className='flex justify-end'>
        <CreateCourseDialog
          trigger={
            <Button className='bg-foreground text-accent-foreground hover:bg-muted hover:text-muted-foreground'>
              Add course
            </Button>
          }
        />
      </div>
      {updateMutation.isError ? (
        <div className='mt-4'>
          Update error:{' '}
          {updateMutation.error instanceof Error
            ? updateMutation.error.message
            : 'Unknown error'}
        </div>
      ) : null}
    </>
  );
};

export default CoursesTable;
