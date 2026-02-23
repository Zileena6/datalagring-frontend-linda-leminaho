// 'use client';

// import { participantService } from '@/utils/action';
// import {
//   Table,
//   TableBody,
//   TableCaption,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '../ui/table';
// import Link from 'next/link';
// import { Trash2, Edit } from 'lucide-react';
// import { useQuery } from '@tanstack/react-query';

// const StudentsTable = () => {
//   const {
//     data: students = [],
//     isPending,
//     isError,
//     error,
//   } = useQuery({
//     queryKey: ['participants', 'students'],
//     queryFn: ({ signal }) => participantService.getAllStudents(signal),
//   });

//   if (isPending) return <div>Loading...</div>;

//   if (isError)
//     return (
//       <div>
//         Error: {error instanceof Error ? error.message : 'Unknown error'}
//       </div>
//     );

//   return (
//     <>
//       <Table>
//         <TableCaption>Students</TableCaption>
//         <TableHeader>
//           <TableRow>
//             <TableHead>Firstname</TableHead>
//             <TableHead>Lastname</TableHead>
//             <TableHead>Email</TableHead>
//             <TableHead>Phone Number</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {students.map(({ id, firstName, lastName, email, phoneNumber }) => (
//             <TableRow key={id}>
//               <TableCell>
//                 <Link href={`/participants/${id}`}>{firstName}</Link>
//               </TableCell>
//               <TableCell>
//                 <Link href={`/participants/${id}`}>{lastName}</Link>
//               </TableCell>
//               <TableCell>
//                 <Link href={`/participants/${id}`}>{email}</Link>
//               </TableCell>
//               <TableCell>
//                 <Link href={`/participants/${id}`}>{phoneNumber}</Link>
//               </TableCell>

//               <TableCell className='flex gap-2'>
//                 <Trash2 className='text-muted-foreground' />
//                 <Edit className='text-muted-foreground' />
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </>
//   );
// };

// export default StudentsTable;
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
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2 } from 'lucide-react';

import CDialog from '@/components/dialog/CDialog';

import type {
  UpdateParticipantDTO,
  UpdateParticipantFormValues,
} from '@/utils/types/dto';
import { buildParticipantEdit } from '../forms/fieldBuilders';
import CreateStudentDialog from './CreateStudentDialog';

const StudentsTable = () => {
  const queryClient = useQueryClient();

  const {
    data: students = [],
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ['participants', 'students'],
    queryFn: ({ signal }) => participantService.getAllStudents(signal),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateParticipantDTO }) =>
      participantService.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['participants', 'students'] });
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
          {students.map((student) => {
            const { fields, initialValues } = buildParticipantEdit(student);

            return (
              <TableRow key={student.id}>
                <TableCell>
                  <Link href={`/participants/${student.id}`}>
                    {student.firstName}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/participants/${student.id}`}>
                    {student.lastName}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/participants/${student.id}`}>
                    {student.email}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/participants/${student.id}`}>
                    {student.phoneNumber}
                  </Link>
                </TableCell>
                <TableCell>
                  {new Date(student.createdAt).toLocaleString('sv-SE')}
                </TableCell>

                <TableCell className='flex gap-2'>
                  <Trash2 />

                  <CDialog<UpdateParticipantFormValues>
                    title='Edit student'
                    description="Make changes to the student. Click save when you're done."
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
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <div className='w-full flex justify-end px-4'>
        <CreateStudentDialog />
      </div>

      {updateMutation.isError ? (
        <div className='mt-4'>
          Error:{' '}
          {updateMutation.error instanceof Error
            ? updateMutation.error.message
            : 'Unknown error'}
        </div>
      ) : null}
    </div>
  );
};

export default StudentsTable;
