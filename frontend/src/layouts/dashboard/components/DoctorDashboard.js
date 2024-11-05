// DoctorDashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { AddEventForm } from './AddEventForm';

const DoctorDashboard = () => {
  const [events, setEvents] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [cancelledAppointments, setCancelledAppointments] = useState([]);
  const [doctorEvents, setDoctorEvents] = useState([]);
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [selectedAppointments, setSelectedAppointments] = useState([]);
  const doctorId = localStorage.getItem('id');

  useEffect(() => {
    axios.get(`/events?doctorId=${doctorId}`)
      .then(response => {
        setDoctorEvents(response.data);
        setEvents(response.data);
      })
      .catch(error => console.error(error));

    axios.get(`/appointments?doctorId=${doctorId}`)
      .then(response => {
        const upcoming = response.data.filter(appointment => appointment.status === 'upcoming');
        const cancelled = response.data.filter(appointment => appointment.status === 'cancelled');
        setUpcomingAppointments(upcoming);
        setCancelledAppointments(cancelled);
        setAppointments(response.data);
      })
      .catch(error => console.error(error));
  }, [doctorId]);

  const handleDateClick = (arg) => {
    const date = arg.date;
    const selectedEvents = events.filter(event => event.eventDate === date);
    const selectedAppointments = appointments.filter(appointment => appointment.date === date);
    
    setSelectedEvents(selectedEvents);
    setSelectedAppointments(selectedAppointments);
  };

  return (
    <div className="maincontainer">
      <div className="calendar-container">
        <FullCalendar
          plugins={[dayGridPlugin]}
          events={events}
          dateClick={handleDateClick}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,dayGridWeek,dayGridDay'
          }}
          height={600}
        />
      </div>
      <div className="selected-date-container">
        {selectedEvents.length > 0 && (
          <div>
            <h2>Events for {selectedEvents[0].eventDate}</h2>
            <ul>
              {selectedEvents.map(event => (
                <li key={event._id}>
                  <p>Event Name: {event.eventName}</p>
                  <p>Event Time: {event.eventTime}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
        {selectedAppointments.length > 0 && (
          <div>
            <h2>Appointments for {selectedAppointments[0].date}</h2>
            <ul>
              {selectedAppointments.map(appointment => (
                <li key={appointment._id}>
                  <p>Patient Name: {appointment.patientName}</p>
                  <p>Appointment Time: {appointment.time}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <AddEventForm />
      <div className="cards-container">
        <div className="row">
          <div className="col-md-4">
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
          </div>
          <div className="col-md-4">
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
                      <hr />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div className="card">
          <div className="card-header">Events</div>
          <div className="card-body">
            {doctorEvents.length === 0 ? (
              <p>No events</p>
            ) : (
              doctorEvents.map(event => (
                <div key={event._id} className="mb-4">
                  <p className="fw-bold"><b>Event Name: </b>{event.eventName}</p>
                  <p className="fw-bold"><b>Event Date: </b>{event.eventDate}</p>
                  <p className="fw-bold"><b>Event Time: </b>{event.eventTime}</p>
                  <hr />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

);
};

export default DoctorDashboard;