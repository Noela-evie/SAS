// AddEventForm.js
import React, { useState } from 'react';
import axios from 'axios';

export const AddEventForm = () => {
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const doctorId = localStorage.getItem('id');

  const handleSubmit = (event) => {
    event.preventDefault();
    axios.post('/events', {
      eventName,
      eventDate,
      eventTime,
      doctor: doctorId
    })
      .then(response => {
        setEventName('');
        setEventDate('');
        setEventTime('');
        alert('Event added successfully!');
      })
      .catch(error => console.error(error));
  };

  return (
    <form className="add-event-form" onSubmit={handleSubmit}>
      <label>Event Name:</label>
      <input type="text" value={eventName} onChange={(e) => setEventName(e.target.value)} />
      <br />
      <label>Event Date:</label>
      <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
      <br />
      <label>Event Time:</label>
      <input type="time" value={eventTime} onChange={(e) => setEventTime(e.target.value)} />
      <br />
      <button type="submit">Add Event</button>
    </form>
  );
};