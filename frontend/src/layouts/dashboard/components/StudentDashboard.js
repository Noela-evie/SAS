import React from 'react'
import { useEffect, useState } from 'react';
import axios from 'axios';
import AssignmentList from '../studentComponents/assignmentList';
import NotificationList from '../studentComponents/notificationList';

const StudentDashboard = () => {
  const [courseUnits, setCourseUnits] = useState([]);
  const [resources, setResources] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const userId = localStorage.getItem('id');

  // Fetch Student Profile and Course Data
  useEffect(() => {
    const fetchProfile = async () => {
      const { data } = await axios.get(`/api/students/${userId}`);
      if (data.course) fetchCourseData(data.course);
    };

    const fetchCourseData = async (course) => {
      const resourcesResponse = await axios.get(`/api/resources/course/${course}`);
      setResources(resourcesResponse.data);

      const assignmentsResponse = await axios.get(`/api/assignments/course/${course}`);
      setAssignments(assignmentsResponse.data);
    };

    fetchProfile();
  }, [userId]);

  return (
    <div className="dashboard">
      <h1>Student Dashboard</h1>
      
      <section className="resources">
        <h2>Resources</h2>
        
      </section>
      
      <section className="assignments">
        <h2>Assignments</h2>
        <AssignmentList assignments={assignments} userId={userId} setNotifications={setNotifications} />
      </section>

      <section className="notifications">
        <h2>Notifications</h2>
        <NotificationList notifications={notifications} />
      </section>
    </div>
  );
};

export default StudentDashboard;


