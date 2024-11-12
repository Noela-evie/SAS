import React, { useState, useEffect } from 'react';
import { lecturerApi, profileApi } from '../../../appClient';
import BookSearch from './Booksearch';


const LecturerDashboard = () => { 
  const lecturerId = localStorage.getItem('id'); 
  const [lecturerProfile, setLecturerProfile] = useState({}); 
  const [resources, setResources] = useState([]); 
  const [assignments, setAssignments] = useState([]); 
  const [submissions, setSubmissions] = useState([]); 
  const [selectedAssignment, setSelectedAssignment] = useState(null); 
  const [newResource, setNewResource] = useState({ 
    resourceName: '', 
    resourceType: '', 
    courseunit: '', 
    course: '', 
    file: null, 
  }); 
  const [newAssignment, setNewAssignment] = useState({ 
    deadlineDate: '', 
    deadlineTime: '', 
    type: 'individual', 
    course: '', 
    file: null, 
  });

  useEffect(() => { 
    const fetchLecturerProfile = async () => { 
      try { 
        const response = await profileApi.getLecturerProfile(lecturerId); 
        setLecturerProfile(response); 
      } catch (error) { 
        console.error(error); 
      } 
    }; 
    fetchLecturerProfile(); 
  }, [lecturerId]);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await lecturerApi.getAllResources(lecturerId);
        setResources(response);
      } catch (error) {
        console.error(error);
      }
    };
    fetchResources();
  }, [lecturerId]);
  
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await lecturerApi.getAllAssignments(lecturerId);
        setAssignments(response);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAssignments();
  }, [lecturerId]);

  const handleResourceChange = (event) => { 
    setNewResource({ ...newResource, [event.target.name]: event.target.value }); 
  };

  const handleAssignmentChange = (event) => { 
    setNewAssignment({ ...newAssignment, [event.target.name]: event.target.value }); 
  };

  const handleFileChange = (event) => { 
    setNewResource({ ...newResource, file: event.target.files[0] }); 
  };

  const handleAssignmentFileChange = (event) => { 
    setNewAssignment({ ...newAssignment, file: event.target.files[0] }); 
  };

  const uploadResource = async () => { 
    try { 
      const response = await lecturerApi.uploadResource(newResource, lecturerId); 
      alert('Resource uploaded successfully'); 
      setResources([...resources, response]); 
      setNewResource({ 
        resourceName: '', 
        resourceType: '', 
        courseunit: '', 
        course: '', 
        file: null, 
      }); 
    } catch (error) { 
      console.error(error); 
    } 
  };

  const setAssignment = async () => { 
    try { 
      const response = await lecturerApi.setAssignment(newAssignment, lecturerId); 
      alert('Assignment set successfully'); 
      setAssignments([...assignments, response]); 
      setNewAssignment({ 
        assignmentName: '',
        deadlineDate: '', 
        deadlineTime: '', 
        type: 'individual', 
        course: '', 
        file: null, 
      }); 
    } catch (error) { 
      console.error(error); 
    } 
  };

  const viewSubmissions = async (assignmentId) => { 
    try { 
      const response = await lecturerApi.getAllSubmissions(assignmentId); 
      setSubmissions(response); 
      setSelectedAssignment(assignmentId); 
    } catch (error) { 
      console.error(error); 
    } 
  };

  const downloadAllSubmissions = async () => { 
    try { 
      const response = await lecturerApi.downloadAllSubmissions(selectedAssignment); 
      const url = window.URL.createObjectURL(new Blob([response], { type: 'application/zip' })); 
      const link = document.createElement('a'); 
      link.href = url; 
      link.download = `assignment-${selectedAssignment}-submissions.zip`; 
      link.click(); 
      window.URL.revokeObjectURL(url); 
    } catch (error) { 
      console.error(error); 
    } 
  };

  const deleteResource = async (resourceId) => { 
    try { 
      await lecturerApi.deleteResource(resourceId); 
      alert('Resource deleted successfully');
      setResources(resources.filter((resource) => resource._id !== resourceId));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="lecturer-dashboard container mx-auto p-4 md:p-6 lg:p-8">
      <section className=" p-4 mb-6">
        <h1 className="text-center text-4xl font-bold text-blue-800 mb-8">Welcome to your Dashboard!</h1>
      </section>
  
      <section className='p-4 mb-6  text-blue-800'><BookSearch /></section>


      <section className="p-4 mb-6 border-2 border-blue-500 rounded-lg">
        <h2 className="text-2xl font-bold text-blue-500 mb-2">Upload Resource</h2>
        <div className="grid grid-cols-1 gap-6">
          <div className="w-full rounded-lg shadow-md p-4">
            <div className="flex flex-col mb-4">
              <label className="text-lg mb-2">Resource Name</label>
              <input 
                type="text" 
                name="resourceName" 
                value={newResource.resourceName} 
                onChange={(e) => setNewResource({ ...newResource, resourceName: e.target.value })} 
                placeholder="Resource Name" 
                className="w-full p-2 border border-gray-300 hover:border-purple-500 focus:outline-none focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
            <div className="flex flex-col mb-4">
              <label className="text-lg mb-2">Resource Type</label>
              <select 
                name="resourceType" 
                value={newResource.resourceType} 
                onChange={(e) => setNewResource({ ...newResource, resourceType: e.target.value })} 
                className="w-full p-2 border border-gray-300 hover:border-purple-500 focus:outline-none focus:border-purple-500 focus:ring-purple-500"
              >
                <option value="">Select Resource Type</option>
                <option value="Notes">Notes</option>
                <option value="Textbooks">Textbooks</option>
                <option value="Pastpapers">Pastpapers</option>
              </select>
            </div>
            <div className="flex flex-col mb-4">
              <label className="text-lg mb-2">Course Unit</label>
              <select 
                name="courseunit" 
                value={newResource.courseunit} 
                onChange={(e) => setNewResource({ ...newResource, courseunit: e.target.value })} 
                className="w-full p-2 border border-gray-300 hover:border-purple-500 focus:outline-none focus:border-purple-500 focus:ring-purple-500"
              >
                <option value="">Select Course Unit</option>
                <option value="Computer Systems">Computer Systems</option>
                <option value="Computer Networks">Computer Networks</option>
                <option value="Operating Systems">Operating Systems</option>
                <option value="Cyber Security">Cyber Security</option>
                <option value="Machine Learning">Machine Learning</option>
              </select>
            </div>
            <div className="flex flex-col mb-4">
              <label className="text-lg mb-2">Course</label>
              <select 
                name="course" 
                value={newResource.course} 
                onChange={(e) => setNewResource({ ...newResource, course: e.target.value })} 
                className="w-full p-2 border border-gray-300 hover:border-purple-500 focus:outline-none focus:border-purple-500 focus:ring-purple-500"
              >
                <option value="">Select Course</option>
                <option value="BIST">BIST</option>
                <option value="BSE">BSE</option>
                <option value="CSC">CSC</option>
              </select>
            </div>
            <div className="flex flex-col mb-4">
              <label className="text-lg mb-2">Resource File</label>
              <input 
                type="file" 
                name="resourceContent" 
                onChange={(e) => setNewResource({ ...newResource, file: e.target.files[0] })} 
                className="w-full p-2 border border-gray-300 hover:border-purple-500 focus:outline-none focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
            <button 
              onClick={uploadResource} 
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 text-xs rounded"
            >
              Upload Resource
            </button>
          </div>
        </div>
      </section>
  
      <section className="bg-white p-4 mb-6 rounded-lg w-full">
        <h2 className="text-2xl font-bold text-blue-500 mb-2">View Resources</h2>
        {resources.length === 0 ? (
          <p>No resources available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource) => (
              <div key={resource._id} className="bg-blue-50 rounded-lg shadow-md p-4">
                <p className="text-lg"><b>Name: </b>{resource.resourceName}</p>
                <p className="text-lg"><b>Type: </b>{resource.resourceType}</p>
                <p className="text-lg"><b>Course Unit: </b>{resource.courseunit}</p>
                <p className="text-lg"><b>Course: </b>{resource.course}</p>
                <button
                  onClick={() => window.open(resource.resourceContent, "_self")}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-2 text-xs"
                >
                  Download Resource
                </button>
                <button
                  onClick={() => deleteResource(resource._id)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded text-xs"
                >
                  Delete Resource
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
  
      <section className="p-4 mb-6 border-2 border-blue-500 rounded-lg">
        <h2 className="text-2xl font-bold text-blue-500 mb-2">Set Assignment</h2>
        <div className="grid grid-cols-1 gap-6">
          <div className="w-full rounded-lg shadow-md p-4">
            <div className="flex flex-col mb-4">
              <label className="text-lg mb-2">Assignment Name</label>
              <input 
                type="text" 
                name="assignmentName" 
                value={newAssignment.assignmentName} 
                onChange={(e) => setNewAssignment({ ...newAssignment, assignmentName: e.target.value })} 
                placeholder="Assignment Name" 
                className="w-full p-2 border border-gray-300 hover:border-purple-500 focus:outline-none focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
            <div className="flex flex-col mb-4">
              <label className="text-lg mb-2">Deadline Date</label>
              <input 
                type="date" 
                name="deadlineDate" 
                value={newAssignment.deadlineDate} 
                onChange={(e) => setNewAssignment({ ...newAssignment, deadlineDate: e.target.value })} 
                placeholder="Deadline Date" 
                className="w-full p-2 border border-gray-300 hover:border-purple-500 focus:outline-none focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
            <div className="flex flex-col mb-4">
              <label className="text-lg mb-2">Deadline Time</label>
              <input 
                type="time" 
                name="deadlineTime" 
                value={newAssignment.deadlineTime} 
                onChange={(e) => setNewAssignment({ ...newAssignment, deadlineTime: e.target.value })} 
                placeholder="Deadline Time" 
                className="w-full p-2 border border-gray-300 hover:border-purple-500 focus:outline-none focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
            <div className="flex flex-col mb-4">
              <label className="text-lg mb-2">Assignment Type</label>
              <select 
                name="type" 
                value={newAssignment.type} 
                onChange={(e) => setNewAssignment({ ...newAssignment, type: e.target.value })} 
                className="w-full p-2 border border-gray-300 hover:border-purple-500 focus:outline-none focus:border-purple-500 focus:ring-purple-500"
              >
                <option value="">Select Assignment Type</option>
                <option value="individual">Individual</option>
                <option value="group">Group</option>
              </select>
            </div>
            <div className="flex flex-col mb-4">
              <label className="text-lg mb-2">Course</label>
              <select 
                name="course" 
                value={newAssignment.course} 
                onChange={(e) => setNewAssignment({ ...newAssignment, course: e.target.value })} 
                className="w-full p-2 border border-gray-300 hover:border-purple-500 focus:outline-none focus:border-purple-500 focus:ring-purple-500"
              >
                <option value="">Select Course</option>
                <option value="BIST">BIST</option>
                <option value="BSE">BSE</option>
                <option value="CSC">CSC</option>
              </select>
            </div>
            <div className="flex flex-col mb-4">
              <label className="text-lg mb-2">Assignment File</label>
              <input 
                type="file" 
                name="assignmentFile" 
                onChange={(e) => setNewAssignment({ ...newAssignment, file: e.target.files[0] })} 
                className="w-full p-2 border border-gray-300 hover:border-purple-500 focus:outline-none focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
            <button 
              onClick={setAssignment} 
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 text-xs rounded"
            >
              Set Assignment
            </button>
          </div>
        </div>
      </section>

      <section className="bg-white p-4 mb-6 rounded-lg w-full">
      <h2 className="text-2xl font-bold text-blue-500 mb-2">View Assignments you set</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assignments.map((assignment) => (
          <div key={assignment._id} className="bg-blue-50 rounded-lg shadow-md p-4">
            <p className="text-lg"><b>Name: </b>{assignment.assignmentName}</p>
            <p className="text-lg">
              <b>Deadline: </b>
              {new Date(assignment.deadlineDate).toLocaleString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
              })}
            </p>            
            <p className="text-lg"><b>Type: </b>{assignment.Type}</p>
            <p className="text-lg"><b>Course: </b>{assignment.course}</p>
            <p className="text-lg"><b>Status: </b>{assignment.status}</p>

            <button
              onClick={() => window.open(assignment.assignment, "_self")}
              className="bg-white hover:bg-grey-subtle text-blue-800 font-bold py-2 px-4 rounded mb-2 text-xs"
            >
              Download Assignment
            </button>
            <button
              onClick={() => viewSubmissions(assignment._id)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-xs "
            >
              View Submissions
            </button>
          </div>
        ))}
      </div>
    </section>
    {selectedAssignment && (
      <section className="bg-white p-4 mb-6 border-2 border-blue-500 rounded-lg">
        <h2 className="text-2xl font-bold text-blue-500 mb-2">Submissions for Assignment {selectedAssignment}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {submissions.map((submission) => (
            <div key={submission._id} className="bg-blue-50 rounded-lg shadow-md p-4">
              <p className="text-lg">{submission.studentName}</p>
              <p className="text-lg">{submission.submissionDate}</p>
              <button
                onClick={() => window.open(submission.submissionFile, "_blank")}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                View Submission
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={downloadAllSubmissions}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Download All Submissions
        </button>
      </section>
    )}

<style>
{`
  .flex flex-col label {
    position: absolute;
    top: 10px;
    left: 10px;
    font-size: 16px;
    color: #666;
    transition: 0.2s;
  }
    .flex flex-col input:focus + label,
          .flex flex-col input:not(:placeholder-shown) + label {
            top: -20px;
            font-size: 14px;
            color: #333;
          }

          .flex flex-col input {
            padding-top: 20px;
          }
        `}
      </style>
    </div>
 
);
};

export default LecturerDashboard;
