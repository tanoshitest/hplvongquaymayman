import { useState } from 'react';
import EventView from '@/components/EventView';
import AdminDashboard from '@/components/AdminDashboard';

const Index = () => {
  const [view, setView] = useState<'event' | 'admin'>('event');

  return view === 'event' ? (
    <EventView onGoAdmin={() => setView('admin')} />
  ) : (
    <AdminDashboard onGoBack={() => setView('event')} />
  );
};

export default Index;
