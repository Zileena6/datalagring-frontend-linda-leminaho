'use client';

import { participantService } from '@/utils/action';
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
import { Trash2, Edit } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

const StudentsTable = () => {
  const {
    data: students = [],
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ['participants', 'students'],
    queryFn: ({ signal }) => participantService.getAllStudents(signal),
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
        <TableCaption>Students</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Firstname</TableHead>
            <TableHead>Lastname</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone Number</TableHead>
            <TableHead>Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map(
            ({ id, firstName, lastName, email, phoneNumber, createdAt }) => (
              <TableRow key={id}>
                <TableCell>
                  <Link href={`/participants/${id}`}>{firstName}</Link>
                </TableCell>
                <TableCell>
                  <Link href={`/participants/${id}`}>{lastName}</Link>
                </TableCell>
                <TableCell>
                  <Link href={`/participants/${id}`}>{email}</Link>
                </TableCell>
                <TableCell>
                  <Link href={`/participants/${id}`}>{phoneNumber}</Link>
                </TableCell>
                <TableCell>
                  {new Date(createdAt).toLocaleString('sv-SE')}
                </TableCell>
                <TableCell className='flex gap-2'>
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

export default StudentsTable;
