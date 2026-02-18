import { participantService } from '@/utils/action';

const ParticipantList = async () => {
  const participants = await participantService.getAll();

  return (
    <ul>
      {participants.map((a) => (
        <li key={a.id}>
          {a.firstName} {a.lastName}
        </li>
      ))}
    </ul>
  );
};

export default ParticipantList;
