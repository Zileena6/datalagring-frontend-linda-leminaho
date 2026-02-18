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
import { serverFetcher } from '@/utils/fetcher.server';
import { Participant } from '@/utils/types/types';

const ParticipantsTable = async () => {
  const participants = await serverFetcher<Participant[]>('/participants');

  return (
    <div className='w-full max-w-300'>
      <h1 className='font-bold text-2xl mb-6 underline'>Participants</h1>
      <Table>
        <TableCaption>All participants</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Firstname</TableHead>
            <TableHead>Lastname</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {participants.map(({ id, email, firstName, lastName, role }) => (
            <TableRow key={id}>
              <TableCell>
                <Link href={`/participants/${id}`}>{email}</Link>
              </TableCell>
              <TableCell>
                <Link href={`/participants/${id}`}>{firstName}</Link>
              </TableCell>
              <TableCell>
                <Link href={`/participants/${id}`}>{lastName}</Link>
              </TableCell>
              <TableCell>
                <Link href={`/participants/${id}`}>{role}</Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4} className='text-center'>
              Click a name to view participant details
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

export default ParticipantsTable;
