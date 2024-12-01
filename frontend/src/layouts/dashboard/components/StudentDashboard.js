import React, { useState, useEffect } from 'react';
import { studentApi, notificationApi, profileApi } from '../../../appClient';
import axios from 'axios';
import BookSearch from './Booksearch';

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
  const [loaded, setLoaded] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedFile, setSelectedFile] = useState(false);
  const [searchResults, setSearchResults] = useState([]);


  useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        const response = await profileApi.getStudentProfile(userId);
        setStudentProfile(response);
        setIsGroupLeader(response.isGroupLeader);
        setLoaded(true);
      } catch (error) {
        console.error(error);
      }
    };
    fetchStudentProfile();
  }, [userId]);

  useEffect(() => {
    if (loaded) {
      const fetchAssignments = async () => {
        try {
          const response = await studentApi.getAllAssignments(studentProfile.course);
          setAssignments(response);
        } catch (error) {
          console.error(error);
        }
      };
      fetchAssignments();
    }
  },
   [loaded, studentProfile.course] );

      useEffect(() => {
        if (loaded && studentProfile.groupname) {
          const fetchGroupMembers = async () => {
            try {
              const response = await studentApi.getGroupMembers(studentProfile.groupname);
              setGroupMembers(response);
            } catch (error) {
              console.error(error);
            }
          };
          fetchGroupMembers();
        }
      }, [loaded, studentProfile.groupname]);

      const fetchResources = async () => {
        try {
          const response = await studentApi.getAllCourseResources(studentProfile.course);
          setResources(response);
        } catch (error) {
          console.error(error);
        }
      };
      fetchResources();

      const fetchSubmissions = async () => {
        try {
          const response = await studentApi.getSubmissionsByUser(userId);
          setSubmissions(response);
        } catch (error) {
          console.error(error);
        }
      };
      fetchSubmissions();

      useEffect(() => {
        if (loaded && studentProfile.groupname) {
          const fetchGroupMembers = async () => {
            try {
              const response = await studentApi.getGroupMembers(studentProfile.groupname);
              setGroupMembers(response);
            } catch (error) {
              console.error(error);
            }
          };
          fetchGroupMembers();
        }
      }, [loaded, studentProfile.groupname]);


  const editSubmission = async (assignmentId) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await studentApi.makeSubmission(assignmentId, userId, file);
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  const submitAssignment = async (e, assignmentId) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', selectedFile);
  
    try {
      const response = await studentApi.makeSubmission(assignmentId, userId, formData);
      const notificationData = {
        studentId: userId,
        title: 'New Submission',
        message: `Submission was recieved successfully!`,
      };
      await notificationApi.postNotification(notificationData);
      alert('Submission successful! You have received a notification.');
      setSelectedFile(false);
      e.target.value = null; // Reset file input
    } catch (error) {
      console.error(error);
      alert('Error submitting assignment: ' + error.message);
    }
  };
  const submitGroupAssignment = async (e, assignmentId) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await studentApi.makeGroupSubmission(assignmentId, userId, formData);
      console.log(response);
      const notificationData = {
        studentId: userId,
        title: 'Group Assignment Submission',
        message: `Your group submission has been submitted successfully!`,
      };
      await notificationApi.postNotification(notificationData);
      alert('Submission successful! You have received a notification.');
      setFile(null); 
    } catch (error) {
      console.error(error);
    }
  };

  const getResourcesByType = async (type) => {
    try {
      const response = await studentApi.getResourcesByType(type);
      setResourcesByType(response);
    } catch (error) {
      console.error(error);
    }
  };

  if (!loaded) {
    return <div className="text-center">Loading...</div>;
  }

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;

    try {
      const response = await axios.get(`/api/search`, {
        params: { query }
      });
      setSearchResults(response.data.data); // Assumes data contains an array of results
    } catch (error) {
      console.error('Error fetching search results:', error.message);
    }
  };



  return (
    <div className="student-dashboard container mx-auto p-4 md:p-6 lg:p-8">
      <section className="p-4 mb-6">
        <h1 className="text-4xl font-bold text-blue-800 mb-8">Student Dashboard</h1>
      </section>

        <section className='p-4 mb-6  text-blue-800'><BookSearch /></section>


      <section className="bg-white p-4 mb-6 rounded-lg w-full">
        <h2 className="text-2xl font-bold text-blue-500 mb-2">Assignments</h2>
        <div className="text-1xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assignments.map((assignment) => (
  <div key={assignment._id} className="bg-blue-50 rounded-lg shadow-md p-4">
    <p className="text-lg"><b>Name: </b>{assignment.assignmentName}</p>
    <p className="text-lg"> <b>Deadline: </b> 
      {new Date(assignment.deadlineDate).toLocaleString('en-GB', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric', 
        hour: 'numeric', 
        minute: 'numeric', 
      })}
    </p>
    <p className="text-lg"><b>Type: </b>{assignment.Type}</p>
    <p className="text-lg"><b>Status: </b>{assignment.status}</p>
    <a href={assignment.assignmentFile} download className="bg-blue-500 hover:bg-blue-700 text-white text-xs font-bold py-2 px-4 rounded" > 
      Download Assignment 
    </a>
    <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} className="mt-2" />
    <button 
      onClick={(e) => submitAssignment(e, assignment._id)} 
      className="bg-blue-500 hover:bg-blue-700 text-white text-xs font-bold py-2 px-4 rounded mt-2"
    > 
      Submit 
    </button>
    {assignment.submission && (
      <div className="mt-4">
        <p>Submission: {assignment.submission.fileName}</p>
        <button
          onClick={() => editSubmission(assignment._id)}
          className="bg-blue-500 hover:bg-blue-700 text-white text-xs font-bold py-2 px-4 rounded"
        >
          Edit Submission
        </button>
      </div>
    )}
  </div>
))}

        </div>
      </section>
  
      <section className="border-2 border-blue-500 rounded-lg p-4 mb-6">
        <h2 className="text-2xl font-bold text-blue-500 mb-2">Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource) => (
            <div key={resource._id} className="bg-white rounded-lg shadow-md p-4">
              <p className="text-lg"><b>Name: </b>{resource.resourceName}</p>
                <p className="text-lg"><b>Type: </b>{resource.resourceType}</p>
                <p className="text-lg"><b>Course Unit: </b>{resource.courseunit}</p>
                <p className="text-lg"><b>Course: </b>{resource.course}</p>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold text-xs py-2 px-4 rounded"
                onClick={() => window.open(resource.resourceContent, '_blank')}
              >
                Download
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white p-4 mb-6">
        <h2 className="text-2xl font-bold text-blue-500 mb-2">Resources by Type</h2>
        <select
          onChange={(e) => getResourcesByType(e.target.value)}
          className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 mb-6 pr-8 rounded focus:outline-none focus:shadow-outline"
        >
          <option value="">Select Resource Type</option>
          <option value="Notes">Notes</option>
          <option value="Textbooks">Textbooks</option>
          <option value="Pastpapers">Pastpapers</option>
        </select>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resourcesByType.map((resource) => (
            <div key={resource._id} className="bg-blue-50 rounded-lg shadow-md p-4">
              <div className="flex justify-between">
                <p className="text-lg">{resource.resourceName}</p>
              </div>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white text-xs font-bold py-2 px-4 rounded"
                href={resource.resourceContent}
                download
              >
                Download
              </button>
            </div>
          ))}
        </div>
      </section>
      <section className="border-2 border-blue-500 p-4 mb-6">
        <h2 className="text-2xl font-bold text-blue-500 mb-2">Submissions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {submissions.map((submission) => (
            <div key={submission._id} className="bg-white rounded-lg shadow-md p-4 ">
                <p className="text-1xl"><b>Submitted on: </b>
                {new Date(submission.submittedAt).toLocaleString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
              })}</p>
              <a
                href={submission.file}
                download
                className="bg-blue-500 hover:bg-blue-700 text-white text-xs font-bold py-2 px-4 rounded"
              >
                Download Submission
              </a>
            </div>
          ))}
        </div>
      </section>

              {isGroupLeader && (
          <section className="bg-white p-4 mb-6">
            <h2 className="text-2xl font-bold text-blue-500 mb-2">Group Members</h2>
            {studentProfile.groupname && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {groupMembers.map((member) => (
                    <div key={member._id} className="bg-blue-50 rounded-lg shadow-md p-4">
                      <p className="text-lg">{member.name}</p>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => fetchGroupMembers(studentProfile.groupname)}
                  className="bg-blue-500 hover:bg-blue-700 text-white text-xs font-bold py-2 px-4 rounded mt-2"
                >
                  Refresh Group Members
                </button>
              </div>
            )}
          </section>
        )}


      {isGroupLeader && assignments.some((assignment) => assignment.Type === 'group') && (
        <section className="bg-gray-50 p-4 mb-6">
          <h2 className="text-2xl font-bold text-blue-500 mb-2">Submit Group Assignment</h2>
          <form onSubmit={(e) => submitGroupAssignment(e)}>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              required
              className="mt-2"
            />
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white text-xs font-bold py-2 px-4 rounded mt-2"
            >
              Submit
            </button>
          </form>
        </section>
      )}
    </div>
);
}

export default StudentDashboard

