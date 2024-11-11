import React, { useState, useEffect } from 'react';
import { adminApi } from '../../../appClient';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userData, setUserData] = useState({ name: '', email: '', role: '', });
  const [lecturers, setLecturers] = useState([]);
  const [selectedLecturer, setSelectedLecturer] = useState(null);
  const [lecturerData, setLecturerData] = useState({ name: '', email: '', role: '', });
  const [selectedStudentCourse, setSelectedStudentCourse] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [studentcourses, setStudentCourses] = useState([
    { _id: 1, name: 'BIST' },
    { _id: 2, name: 'CSC' },
    { _id: 3, name: 'BSE' },
  ]);
  const [courses, setCourses] = useState([
    { _id: 1, name: 'BIST' },
    { _id: 2, name: 'CSC' },
    { _id: 3, name: 'BSE' },
  ]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await adminApi.getAllUsers();
        setUsers(response);
      } catch (error) {
        console.error(error);
      }
    };
    const fetchLecturers = async () => {
      try {
        const response = await adminApi.getAllLecturers();
        setLecturers(response);
      } catch (error) {
        console.error(error);
      }
    };
    const fetchCourses = async () => {
      try {
        const response = await axios.get('/courses');
        setCourses(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUsers();
    fetchLecturers();
    fetchCourses();
  }, []);

  const handleUserSelect = async (userId) => {
    try {
      const response = await adminApi.getUser(userId);
      setSelectedUser(response);
      setUserData(response);
      document.getElementById('editUserSection').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
      console.error(error);
    }
  };

  const handleLecturerSelect = async (lecturerId) => {
    try {
      const response = await adminApi.getUser(lecturerId);
      setSelectedLecturer(response);
      setLecturerData(response);
      document.getElementById('editLecturerSection').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditUser = async (event) => {
    event.preventDefault();
    try {
      const response = await adminApi.editUser(selectedUser._id, userData);
      alert('User updated successfully');
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditLecturer = async (event) => {
    event.preventDefault();
    try {
      const response = await adminApi.editUser(selectedLecturer._id, lecturerData);
      alert('Lecturer updated successfully');
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await adminApi.deleteUser(userId);
      alert('User deleted successfully');
      setUsers(users.filter((user) => user._id !== userId));
    } catch (error) {
      console.error(error);
    }
  };

  const filteredUsers = selectedStudentCourse ? users.filter((user) => user.course === selectedStudentCourse) : users;
  const filteredLecturers = selectedCourse ? lecturers.filter((lecturer) => lecturer.course === selectedCourse) : lecturers;

  const handleStudentCourseChange = (event) => {
    const selectedStudentCourse = event.target.value;
    if (['BIST', 'CSC', 'BSE'].includes(selectedStudentCourse)) {
      setSelectedStudentCourse(selectedStudentCourse);
    } else {
      console.error('Invalid course selected');
    }
  };

  const handleCourseChange = (event) => {
    const selectedCourse = event.target.value;
    if (['BIST', 'CSC', 'BSE'].includes(selectedCourse)) {
      setSelectedCourse(selectedCourse);
    } else {
      console.error('Invalid course selected');
    }
  };


  return (
    <div className="admin-dashboard container mx-auto p-4 md:p-6 lg:p-8">
      <section className="p-4 mb-6">
        <h1 className="text-center text-4xl font-bold text-blue-800 mb-8">
          Welcome to the Admin Dashboard!
        </h1>
        <p className="text-center text-black mb-8">
          User management, Reports and Analytics in one place.
        </p>
      </section>

      <section className="p-4 mb-6 border-2 border-blue-500 rounded-lg">
        <h2 className="text-2xl font-bold text-blue-500 mb-2">
          Manage Users
        </h2>
        <div className="flex flex-col mb-4">
          <label className="text-lg mb-2">Filter by Course</label>
                  <select 
          value={selectedStudentCourse} 
          onChange={handleStudentCourseChange} 
          className="w-full p-2 border border-gray-300 hover:border-purple-500 focus:outline-none focus:border-purple-500 focus:ring-purple-500"
        >
          <option value="">All Courses</option>
          <option value="BIST">BIST</option>
          <option value="CSC">CSC</option>
          <option value="BSE">BSE</option>
        </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <div key={user._id} className="bg-blue-50 rounded-lg shadow-md p-4">
              <p className="text-lg">
                <b>Name: </b>
                {user.name}
              </p>
              <p className="text-lg">
                <b>Email: </b>
                {user.email}
              </p>
              <p className="text-lg">
                <b>Role: </b>
                {user.role}
              </p>
              <button
                onClick={() => handleUserSelect(user._id)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-5"
              >
                View
              </button>
              <button
                onClick={() => handleDeleteUser(user._id)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="p-4 mb-6 border-2 border-blue-500 rounded-lg">
        <h2 className="text-2xl font-bold text-blue-500 mb-2">
          Manage Lecturers
        </h2>
        <div className="flex flex-col mb-4">
          <label className="text-lg mb-2">Filter by Course</label>
          <select 
            value={selectedCourse} 
            onChange={handleCourseChange} 
            className="w-full p-2 border border-gray-300 hover:border-purple-500 focus:outline-none focus:border-purple-500 focus:ring-purple-500"
          >
            <option value="">All Courses</option>
            <option value="BIST">BIST</option>
            <option value="CSC">CSC</option>
            <option value="BSE">BSE</option>
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLecturers.map((lecturer) => (
            <div key={lecturer._id} className="bg-blue-50 rounded-lg shadow-md p-4">
              <p className="text-lg">
                <b>Name: </b>
                {lecturer.name}
              </p>
              <p className="text-lg">
                <b>Email: </b>
                {lecturer.email}
              </p>
              <p className="text-lg">
                <b>Role: </b>
                {lecturer.role}
              </p>
              <button
                onClick={() => handleLecturerSelect(lecturer._id)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-5"
              >
                View
              </button>
              <button
                onClick={() => handleDeleteUser(lecturer._id)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </section>

      {selectedUser && (
        <section id="editUserSection" className="bg-white p-4 mb-6 border-2 border-blue-500 rounded-lg">
          <h2 className="text-2xl font-bold text-blue-500 mb-2">
            Edit User
          </h2>
          <form onSubmit={handleEditUser}>
            <div className="flex flex-col mb-4">
              <label className="text-lg mb-2">Name</label>
              <input
                type="text"
                value={userData.name}
                onChange={(event) =>
                  setUserData({ ...userData, name: event.target.value })
                }
                placeholder="Name"
                className="w-full p-2 border border-gray-300 hover:border-purple-500 focus:outline-none focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
            <div className="flex flex-col mb-4">
              <label className="text-lg mb-2">Email</label>
              <input
                type="email"
                value={userData.email}
                onChange={(event) =>
                  setUserData({ ...userData, email: event.target.value })
                }
                placeholder="Email"
                className="w-full p-2 border border-gray-300 hover:border-purple-500 focus:outline-none focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
            <div className="flex flex-col mb-4"></div>
            <label className="text-lg mb-2">Role</label>
              <select
                value={userData.role}
                onChange={(event) =>
                  setUserData({ ...userData, role: event.target.value })
                }
                className="w-full p-2 border border-gray-300 hover:border-purple-500 focus:outline-none focus:border-purple-500 focus:ring-purple-500"
              >
                <option value="admin">Admin</option>
                <option value="lecturer">Lecturer</option>
                <option value="student">Student</option>
              </select>
            
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Update User
            </button>
            </form>
        </section>
      )}

{selectedLecturer && Object.keys(selectedLecturer).length > 0 && (
  <section id="editLecturerSection" className="bg-white p-4 mb-6 border-2 border-blue-500 rounded-lg">
    <h2 className="text-2xl font-bold text-blue-500 mb-2"> Edit Lecturer </h2>
    <form onSubmit={handleEditLecturer}>
      <div className="flex flex-col mb-4">
        <label className="text-lg mb-2">Name</label>
        <input 
          type="text" 
          value={lecturerData.name} 
          onChange={(event) => setLecturerData({ ...lecturerData, name: event.target.value })} 
          placeholder="Name" 
          className="w-full p-2 border border-gray-300 hover:border-purple-500 focus:outline-none focus:border-purple-500 focus:ring-purple-500"
        />
      </div>
      <div className="flex flex-col mb-4">
        <label className="text-lg mb-2">Email</label>
        <input 
          type="email" 
          value={lecturerData.email} 
          onChange={(event) => setLecturerData({ ...lecturerData, email: event.target.value })} 
          placeholder="Email" 
          className="w-full p-2 border border-gray-300 hover:border-purple-500 focus:outline-none focus:border-purple-500 focus:ring-purple-500"
        />
      </div>
      <div className="flex flex-col mb-4">
        <label className="text-lg mb-2">Role</label>
        <select 
          value={lecturerData.role} 
          onChange={(event) => setLecturerData({ ...lecturerData, role: event.target.value })} 
          className="w-full p-2 border border-gray-300 hover:border-purple-500 focus:outline-none focus:border-purple-500 focus:ring-purple-500"
        >
          <option value="admin">Admin</option>
          <option value="lecturer">Lecturer</option>
        </select>
      </div>
      <button 
        type="submit" 
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      > 
        Update Lecturer 
      </button>
    </form>
  </section>
)}
    </div>

  );
};

export default AdminDashboard;
