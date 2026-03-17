import { useState } from 'react';
import EventView from '@/components/EventView';
import AdminDashboard from '@/components/AdminDashboard';
import { USERS as INITIAL_USERS, PRIZES as INITIAL_PRIZES } from '@/data/mockData';

const Index = () => {
  const [view, setView] = useState<'event' | 'admin'>('event');
  const [users, setUsers] = useState(INITIAL_USERS);
  const [prizes, setPrizes] = useState(INITIAL_PRIZES);

  return view === 'event' ? (
    <EventView
      onGoAdmin={() => setView('admin')}
      users={users}
      setUsers={setUsers}
      prizes={prizes}
    />
  ) : (
    <AdminDashboard
      onGoBack={() => setView('event')}
      users={users}
      setUsers={setUsers}
      prizes={prizes}
      setPrizes={setPrizes}
    />
  );
};

export default Index;
