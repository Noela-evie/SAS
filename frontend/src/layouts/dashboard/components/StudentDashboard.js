import '../student.css'
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudentDashboard = () => {
  const [studentProfile, setStudentProfile] = useState({});
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [resources, setResources] = useState([]);
  const [resourcesByType, setResourcesByType] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [groupMembers, setGroupMembers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isGroupLeader, setIsGroupLeader] = useState(false);
  const [groupId, setGroupId] = useState('');
  const [assignmentId, setAssignmentId] = useState('');
  const [file, setFile] = useState(null);
  const userId = localStorage.getItem('id');

  const editSubmission = async (assignmentId) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.patch(`/student/submit-assignment/${assignmentId}/${userId}`, formData);

    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};

  useEffect(() => {
    axios.get(`/student/profile/${userId}`)
      .then(response => {
        setStudentProfile(response.data);
        setIsGroupLeader(response.data.isGroupLeader);
      })
      .catch(error => console.error(error));

    axios.get(`/assignments`, {
      params: {
        course: studentProfile.course
      }
    })
      .then(response => setAssignments(response.data))
      .catch(error => console.error(error));

      axios.get('/student/course-resources', {
        params: {
          course: studentProfile.course
        }
      })
      .then(response => setResources(response.data))
      .catch(error => console.error(error));

    axios.get(`/student/assignment-submissions/${userId}`)
      .then(response => setSubmissions(response.data))
      .catch(error => console.error(error));

    axios.get(`/student/group-members`, {
      params: {
        groupname: studentProfile.groupname
      }
    })
      .then(response => setGroupMembers(response.data))
      .catch(error => console.error(error));

  }, [userId, studentProfile.groupname, studentProfile.course]);

  const submitAssignment = async (assignmentId) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
  
      const response = await axios.post(`/student/submit-assignment/${assignmentId}/${userId}`, formData);
  
      const notificationData = {
        studentId: userId,
        title: response.data.deadlineDate,
        message: 'Your work has been submitted successfully!',
      };
  
      await axios.post('/student/notifications', notificationData);
  
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const submitGroupAssignment = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await axios.post(`/group/submit-group-assignment/${assignmentId}/${groupId}`, formData);
      console.log(response.data);
    
    
  
  const notificationData = {
    studentId: userId,
    title: response.data.deadlineDate, 
    message: 'Your work has been submitted successfully!',
  };

  await axios.post('/student/notifications', notificationData);

  console.log(response.data);
} catch (error) {
  console.error(error);
}
  }


  const getResourcesByType = async (type) => {
    try {
      const response = await axios.get(`/student/type-resources/${type}`);
      setResourcesByType(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="student-dashboard">
      <h1>Student Dashboard</h1>
      <div className="dashboard-content">
        <h2>Assignments</h2>
        <ul>
        {assignments.map(assignment => (
  <li key={assignment._id}>
    {assignment.assignment} - {assignment.deadlineDate}
    <a href={assignment.assignmentFile} download>Download Assignment</a>
    <input type="file" onChange={(e) => setFile(e.target.files[0])} />
    <button onClick={() => submitAssignment(assignment._id)}>Submit</button>
    {assignment.submission && (
      <div>
        <p>Submission: {assignment.submission.fileName}</p>
        <button onClick={() => editSubmission(assignment._id)}>Edit Submission</button>
      </div>
    )}
  </li>
))}
        </ul>
      </div>

    
     <div className="dashboard-content">
     <h2>Resources for {studentProfile.course}</h2>
     <ul>
     {resources.map(resource => (
      <li key={resource._id}>
        {resource.resourceName} - {resource.resourceType}
        <a href={resource.resourceContent} download>Download</a>
       </li>
      ))}
     </ul>
     </div>

      <div className="dashboard-content">
        <h2>Resources by Type</h2>
        <select onChange={(e) => getResourcesByType(e.target.value)}>
          <option value="">Select Resource Type</option>
          <option value="Notes">Notes</option>
          <option value="Textbooks">Textbooks</option>
          <option value="Pastpapers">Pastpapers</option>
        </select>
        <ul>
          {resourcesByType.map(resource => (
            <li key={resource._id}>
              {resource.resourceName} - {resource.resourceType}
              <a href={resource.resourceContent} download>Download</a>
            </li>
          ))}
        </ul>
      </div>

      <div className="dashboard-content">
        <h2>Submissions</h2>
        <ul>
          {submissions.map(submission => (
            <li key={submission._id}>
              {submission.assignmentId} - {submission.submittedAt}
              <a href={submission.file} download>Download</a>
            </li>
          ))}
        </ul>
      </div>

      {isGroupLeader && (
        <div className="dashboard-content">
          <h2>Group Members</h2>
          <ul>
            {groupMembers.map(member => (
              <li key={member._id}>{member.name}</li>
            ))}
          </ul>
        </div>
      )}

      {isGroupLeader && (
        <div className="dashboard-content">
          <h2>Submit Group Assignment</h2>
          <form onSubmit={(e) => submitGroupAssignment(e)}>
            <input type="file" onChange={(e) => setFile(e.target.files[0])} required />
            <button type="submit">Submit</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;