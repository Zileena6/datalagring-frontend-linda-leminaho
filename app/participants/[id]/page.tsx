import { participantService } from '@/utils/action';

const Participant = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const participant = await participantService.getById(id);

  const { firstName, lastName, email, phoneNumber, role } = participant;

  return (
    <div>
      <h2>
        {firstName} {lastName} -- {role}
      </h2>
      <p>Email {email}</p>
      <p>Phone {phoneNumber}</p>
      {participant.competences && participant.competences.length > 0 ? (
        <div>
          {participant.competences.map(
            (c: { id: string; competenceName: string }) => (
              <span key={c.id}>{c.competenceName}</span>
            ),
          )}
        </div>
      ) : (
        <p>Student</p>
      )}
    </div>
  );
};

export default Participant;
