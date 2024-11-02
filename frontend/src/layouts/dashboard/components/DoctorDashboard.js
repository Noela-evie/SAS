import React, { useEffect } from 'react';

const DoctorDashboard = () => {
  useEffect(() => {
    alert("Welcome to the Doctor Dashboard!");
  }, []);

  return (
    <div>
      <h1>Doctor Dashboard</h1>
     
    </div>
  );
};

export default DoctorDashboard;
