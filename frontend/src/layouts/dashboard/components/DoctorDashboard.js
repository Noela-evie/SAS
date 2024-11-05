import React, { useState, useEffect } from 'react';
import axios from 'axios';


const DoctorDashboard = () => {
  const doctorId = localStorage.getItem('id');

  useEffect(() => {
    axios.get(`/events?doctorId=${doctorId}`)
      .then(response => {
        setDoctorEvents(response.data);
        setEvents(response.data);
      })
      .catch(error => console.error(error));
})
};


export default DoctorDashboard;