import React, { useEffect } from 'react';

const AdminDashboard = () => {
  useEffect(() => {
    alert("Welcome to the Admin Dashboard!");
  }, []);

  return (
    <div>
      <h1>Admin Dashboard</h1>
      {/* Admin-specific content */}
    </div>
  );
};

export default AdminDashboard;
