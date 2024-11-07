import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LecturerDashboard = () => {
  const lecturerId = localStorage.getItem('id');
  const [resources, setResources] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showNoSubmissionsMessage, setShowNoSubmissionsMessage] = useState(false);
  const [newResource, setNewResource] = useState({
    resourceName: '',
    resourceType: '',
    courseunit: '',
    course: '',
    resourceContent: null,
  });
  const [newAssignment, setNewAssignment] = useState({
    deadlineDate: '',
    deadlineTime: '',
    type: 'individual',
    course: '',
    assignment: null,
  });

  useEffect(() => {
    axios.get(`/lecturer/resources?lecturerId=${lecturerId}`)
      .then(response => setResources(response.data))
      .catch(error => console.error(error));

    axios.get(`/lecturer/assignments?lecturerId=${lecturerId}`)
      .then(response => setAssignments(response.data))
      .catch(error => console.error(error));
  }, [lecturerId]);

  const handleResourceChange = (event) => {
    setNewResource({ ...newResource, [event.target.name]: event.target.value });
  };

  const handleAssignmentChange = (event) => {
    setNewAssignment({ ...newAssignment, [event.target.name]: event.target.value });
  };

  const handleFileChange = (event) => {
    setNewResource({ ...newResource, resourceContent: event.target.files[0] });
  };

  const handleAssignmentFileChange = (event) => {
    setNewAssignment({ ...newAssignment, assignment: event.target.files[0] });
  };

  const uploadResource = () => {
    const formData = new FormData();
    formData.append('resourceName', newResource.resourceName);
    formData.append('resourceType', newResource.resourceType);
    formData.append('courseunit', newResource.courseunit);
    formData.append('course', newResource.course);
    formData.append('resourceContent', newResource.resourceContent);

    axios.post(`/lecturer/upload-resource/${lecturerId}`, formData)
    .then(response => {
      alert('Resource uploaded successfully');
      setResources([...resources, response.data]);
      setNewResource({ resourceName: '', resourceType: '', courseunit: '', course: '', resourceContent: null });
    })
    .catch(error => console.error(error));
  };

  const setAssignment = () => {
    const formData = new FormData();
    formData.append('deadlineDate', newAssignment.deadlineDate);
    formData.append('deadlineTime', newAssignment.deadlineTime);
    formData.append('type', newAssignment.type);
    formData.append('course', newAssignment.course);
    formData.append('assignment', newAssignment.assignment);

    axios.post(`/lecturer/set-assignment/${lecturerId}`, formData)
      .then(response => {
        alert('Assignment set successfully');
        setAssignments([...assignments, response.data]);
      })
      .catch(error => console.error(error));
  };

  const viewSubmissions = (assignmentId) => {
    axios.get(`/lecturer/assignment-submissions/${assignmentId}`)
      .then(response => {
        setSubmissions(response.data);
        setSelectedAssignment(assignmentId);
      })
      .catch(error => console.error(error));
  };

  const downloadAllSubmissions = () => {
    const assignmentId = selectedAssignment;
    const lecturerId = localStorage.getItem('id');
  
    axios.post(`/lecturer/download-all-submissions/${assignmentId}/${lecturerId}`, { submissions })
      .then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/zip' }));
        const link = document.createElement('a');
        link.href = url;
        link.download = `assignment-${assignmentId}-submissions.zip`;
        link.click();
        window.URL.revokeObjectURL(url);
      })
      .catch(error => console.error(error));
  };

  const deleteResource = (resourceId) => {
    axios.delete(`/lecturer/delete-resource/${resourceId}`)
      .then(response => {
        alert('Resource deleted successfully');
        setResources(resources.filter(resource => ("#") !== resourceId));
      })
      .catch(error => console.error(error));
  };

  return (
    <div className="lecturer-dashboard">
      <h1>Lecturer Dashboard</h1>

      {/* Upload Resource */}
      <div className="set-assignment">
        <h2>Upload Resource</h2>
        <input 
          type="text" 
          name="resourceName" 
          value={newResource.resourceName} 
          onChange={handleResourceChange} 
          placeholder="Resource Name" 
        />
        <select 
          name="resourceType" 
          value={newResource.resourceType} 
          onChange={handleResourceChange}
        >
          <option value="">Select Resource Type</option>
          <option value="Notes">Notes</option>
          <option value="Textbooks">Textbooks</option>
          <option value="Pastpapers">Pastpapers</option>
        </select>
        <input 
          type="text" 
          name="courseunit" 
          value={newResource.courseunit} 
          onChange={handleResourceChange} 
          placeholder="Course Unit" 
        />
        <select 
          name="course" 
          value={newResource.course} 
          onChange={handleResourceChange}
        >
          <option value="">Select Course</option>
          <option value="BIST">BIST</option>
          <option value="BSE">BSE</option>
          <option value="CSC">CSC</option>
        </select>
        <input 
          type="file" 
          name="resourceContent" 
          onChange={handleFileChange} 
        />
        <button onClick={uploadResource}>Upload Resource</button>
      </div>

      {/* View Resources */}
      <div className="dashboard-content">
  <h2>View Resources</h2>
  <ul>
    {resources.map(resource => (
      <li key={resource._id}>
        {resource.resourceName} - {resource.resourceType}
        <button onClick={() => deleteResource(resource._id)}>Delete</button>
      </li>
    ))}
  </ul>
</div>

      {/* Set Assignment */}
      <div className="set-assignment">
        <h2>Set Assignment</h2>
        <input 
          type="date" 
          name="deadlineDate" 
          value={newAssignment.deadlineDate} 
          onChange={handleAssignmentChange} 
        />
        <input 
          type="time" 
          name="deadlineTime" 
          value={newAssignment.deadlineTime} 
          onChange={handleAssignmentChange} 
        />
        <select 
          name="type" 
          value={newAssignment.type} 
          onChange={handleAssignmentChange}
        >
          <option value="individual">Individual</option>
          <option value="group">Group</option>
        </select>
        <select 
          name="course" 
          value={newAssignment.course} 
          onChange={handleAssignmentChange}
        >
          <option value="">Select Course</option>
          <option value="BIST">BIST</option>
          <option value="BSE">BSE</option>
          <option value="CSC">CSC</option>
        </select>
        <input 
          type="file" 
          name="assignment" 
          onChange={handleAssignmentFileChange} 
        />
        <button onClick={setAssignment}>Set Assignment</button>
      </div>

      {/* View Assignments */}
      <div className="dashboard-content">
  <h2>View Assignments</h2>
  <ul>
  {assignments.map(assignment => (
  <li key={assignment._id}>
    {assignment.type} Assignment - 
    Deadline: {new Date(assignment.deadlineDate).toLocaleString('en-US', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    })} 
     at {new Date(assignment.deadlineDate).toLocaleTimeString('en-US', { hour12: true })}
    <button onClick={() => viewSubmissions(assignment._id)}>View Submissions</button>
  </li>
))}
  </ul>
</div>

      {selectedAssignment && submissions.length > 0 ? (
  <div>
    <h2>View Submissions for Assignment {selectedAssignment}</h2>
    <ul>
    {submissions.map(submission => (
  <li key={submission._id}>
    {submission.userId} - {submission.status} 
    Submitted on: {new Date(submission.createdAt).toLocaleString('en-US', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    })}
    <a href={submission.file} download>Download</a>
  </li>
))}
    </ul>
    <button onClick={downloadAllSubmissions}>Download All Submissions</button>
  </div>
) : (
  !showNoSubmissionsMessage ? (
    <>
      {setShowNoSubmissionsMessage(true)}
      <p>No submissions yet</p>
    </>
  ) : (
    <p>No submissions yet</p>
  )

)}
</div> 
  )}


export default LecturerDashboard;