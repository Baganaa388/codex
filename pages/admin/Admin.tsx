import React, { useState } from 'react';
import { useAdmin } from './useAdmin';
import { AdminLogin } from './AdminLogin';
import { AdminDashboard } from './AdminDashboard';
import { AdminContest } from './AdminContest';

export const Admin: React.FC = () => {
  const { isLoggedIn, setToken, authFetch, logout } = useAdmin();
  const [selectedContestId, setSelectedContestId] = useState<number | null>(null);

  if (!isLoggedIn) {
    return <AdminLogin onLogin={setToken} />;
  }

  if (selectedContestId) {
    return (
      <AdminContest
        contestId={selectedContestId}
        authFetch={authFetch}
        onBack={() => setSelectedContestId(null)}
      />
    );
  }

  return (
    <AdminDashboard
      authFetch={authFetch}
      onSelectContest={setSelectedContestId}
      onLogout={logout}
    />
  );
};
