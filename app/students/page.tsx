import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { participantService } from '@/utils/action';
import Link from 'next/link';

const Students = async () => {
  const students = await participantService.getAllStudents();
  return (
    <div className='flex flex-col w-full grow mt-[10dvh]'>
      <Table>
        <TableCaption>Students</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Firstname</TableHead>
            <TableHead>Lastname</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map(({ id, firstName, lastName, email, role }) => (
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
                <Link href={`/participants/${id}`}>{role}</Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Students;
