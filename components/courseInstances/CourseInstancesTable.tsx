import { courseInstancesService } from '@/utils/action';
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
import { useQuery } from '@tanstack/react-query';
import { Trash2, Edit } from 'lucide-react';

const CourseInstancesTable = () => {
  const {
    data: courseInstances = [],
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ['courseInstances'],
    queryFn: ({ signal }) => courseInstancesService.getAll(signal),
  });

  if (isPending) return <div>Loading...</div>;

  if (isError)
    return (
      <div>
        Error: {error instanceof Error ? error.message : 'Unknown error'}
      </div>
    );

  return (
    <>
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
            <TableHead>Approved students</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courseInstances.map(
            ({
              id,
              course: { id: courseId, courseName },
              courseCode,
              startDate,
              endDate,
              location: { id: locationId, locationName },
              instructors,
              capacity,
              approvedEnrollmentsCount,
            }) => (
              <TableRow key={id}>
                <TableCell>
                  <Link href={`/courses/${courseId}`}>{courseName}</Link>
                </TableCell>
                <TableCell>
                  <Link href={''}>{courseCode}</Link>
                </TableCell>
                <TableCell>
                  <Link href={''}>{startDate}</Link>
                </TableCell>
                <TableCell>
                  <Link href={''}>{endDate}</Link>
                </TableCell>
                <TableCell>
                  <Link href={''}>{locationName}</Link>
                </TableCell>
                <TableCell>
                  {instructors.map(({ id, firstName, lastName }) => (
                    <div key={id}>
                      <Link href={`/participants/${id}`} className='my-1'>
                        {firstName} {lastName}
                      </Link>
                    </div>
                  ))}
                </TableCell>
                <TableCell>
                  <Link href={''}>{capacity}</Link>
                </TableCell>
                <TableCell>
                  <Link href={''}>{approvedEnrollmentsCount}</Link>
                </TableCell>
                <TableCell className='flex gap-3'>
                  <Trash2 className='text-muted-foreground' />
                  <Edit className='text-muted-foreground' />
                </TableCell>
              </TableRow>
            ),
          )}
        </TableBody>
      </Table>
    </>
  );
};

export default CourseInstancesTable;
