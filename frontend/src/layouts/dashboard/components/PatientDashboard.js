import React from 'react'
import { useEffect, useState } from 'react';
import axios from 'axios';

const PatientDashboard = () => {
  const [department, setDepartment] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [reason, setReason] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [cancelledAppointments, setCancelledAppointments] = useState([]);

  const handleDepartmentChange = (event) => setDepartment(event.target.value);
  const handleDateChange = (event) => setDate(event.target.value);
  const handleTimeChange = (event) => setTime(event.target.value);
  const handleReasonChange = (event) => setReason(event.target.value);

  const handleSubmit = (event) => {
    event.preventDefault();
    // Submit handler logic will go here
    console.log('Form submitted:', { department, date, time, reason });
  };

  useEffect(() => {
    const userId = localStorage.getItem('id');
    axios.get(`/appointments?user._id=${userId}`)
      .then(response => {
        const upcomingAppointments = response.data.filter(appointment => appointment.status === 'upcoming');
        setUpcomingAppointments(upcomingAppointments);
      })
      .catch(error => console.error(error));
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem('id');
    axios.get(`/appointments?user._id=${userId}`)
      .then(response => {
        const cancelledAppointments = response.data.filter(appointment => appointment.status === 'cancelled');
        setCancelledAppointments(cancelledAppointments);
      })
      .catch(error => console.error(error));
  }, []);


  return (
    <div className="container">
      <div className="left-container">
          <div className="card-header">Book an Appointment</div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="department">Department</label>
                <select
                  id="department"
                  className="form-select"
                  value={department}
                  onChange={handleDepartmentChange}
                >
                  <option value="">Select Department</option>
                  <option value="General Medicine">General Medicine</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Dermatology">Dermatology</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="date">Date (Cannot be a weekend)</label>
                <input
                  type="date"
                  id="date"
                  className="form-control"
                  value={date}
                  onChange={handleDateChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="time">Time</label>
                <select
                  id="time"
                  className="form-select"
                  value={time}
                  onChange={handleTimeChange}
                >
                  <option value="">Select Time</option>
                  <option value="8:00-10:00 AM">8:00-10:00 AM</option>
                  <option value="10:00 AM-1:00 PM">10:00 AM-1:00 PM</option>
                  <option value="2:00-4:00 PM">2:00-4:00 PM</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="reason">Reason for Appointment</label>
                <textarea
                  id="reason"
                  rows={4}
                  className="form-control"
                  value={reason}
                  onChange={handleReasonChange}
                />
              </div>
              <button type="submit" className="btn">Book Appointment</button>
            </form>
          </div>
    
      </div>
      <div className="right-container">
        <div className="card">
          <div className="card-header">Upcoming Appointments</div>
          <div className="card-body">
            {upcomingAppointments.length === 0 ? (
              <p>No upcoming appointments</p>
            ) : (
              upcomingAppointments.map(appointment => (
                <div key={appointment._id} className="mb-4">
                  <p className="fw-bold">Date: {appointment.date}</p>
                  <p className="fw-bold">Time: {appointment.time}</p>
                  <p className="fw-bold">Department: {appointment.department}</p>
                  <p className="fw-bold">Status: {appointment.status}</p>
                  <hr />
                </div>
              ))
            )}
          </div>
        </div>
        <div className="card">
          <div className="card-header">Cancelled Appointments</div>
          <div className="card-body">
            {cancelledAppointments.length === 0 ? (
              <p>No cancelled appointments</p>
            ) : (
              cancelledAppointments.map(appointment => (
                <div key={appointment._id} className="mb-4">
                  <p className="fw-bold">Date: {appointment.date}</p>
                  <p className="fw-bold">Time: {appointment.time}</p>
                  <p className="fw-bold">Department: {appointment.department}</p>
                  <p className="fw-bold">Status: {appointment.status}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      {success && (
        <div className="alert alert-success">
          <strong>Success!</strong> Appointment booked successfully!
        </div>
      )}
      {error && (
        <div className="alert alert-danger">
          <strong>Error!</strong> Error booking appointment.
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;


