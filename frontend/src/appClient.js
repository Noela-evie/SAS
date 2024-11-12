import axios from 'axios';

// Profile
const profileApi = {
    getStudentProfile: async (studentId) => {
      const response = await axios.get(`/student/profile/${studentId}`);
      return response.data;
    },
  
    getLecturerProfile: async (lecturerId) => {
      const response = await axios.get(`/lecturer/profile/${lecturerId}`);
      return response.data;
    },
  };

// Student Dashboard
const studentApi = {
    getAllAssignments: async (course) => {
      const response = await axios.get(`/assignments/${course}`);
      return response.data;
    },
  
    getSubmissionsByUser: async (studentId) => {
      const response = await axios.get(`/student/assignment-submissions/${studentId}`, studentId);
      return response.data;
    },
  
    makeSubmission: async (assignmentId, studentId, formData) => {
      const response = await axios.post(`/student/submit-assignment/${assignmentId}/${studentId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
  
    makeGroupSubmission: async (assignmentId, studentId, formData) => {
      const response = await axios.post(`/group/submit-assignment/${assignmentId}/${studentId}`, formData);
      return response.data;
    },
  
    getGroupMembers: async (groupname) => {
      const response = await axios.get(`/student/group-members/${groupname}`);
      return response.data;
    },
  
    getAllCourseResources: async (course) => {
      const response = await axios.get(`/student/course-resources/${course}`);
      return response.data;
    },
  
    getResourcesByType: async (type) => {
      const response = await axios.get(`/student/type-resources/${type}`);
      return response.data;
    },
  };
  
  // Lecturer Dashboard
  const lecturerApi = {
    setAssignment: async (assignmentData, lecturerId) => {
      const formData = new FormData();
      formData.append('assignmentFile', assignmentData.file);
      formData.append('assignmentName', assignmentData.assignmentName);
      formData.append('deadlineDate', assignmentData.deadlineDate);
      formData.append('deadlineTime', assignmentData.deadlineTime);
      formData.append('type', assignmentData.type);
      formData.append('course', assignmentData.course);
  
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };
  
      const response = await axios.post(`/lecturer/set-assignment/${lecturerId}`, formData, config);
      return response.data;
    },
  
    uploadResource: async (resourceData, lecturerId) => {
      const formData = new FormData();
      formData.append('resourceContent', resourceData.file);
      formData.append('resourceName', resourceData.resourceName);
      formData.append('resourceType', resourceData.resourceType);
      formData.append('courseunit', resourceData.courseunit);
      formData.append('course', resourceData.course);
    
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };
    
      const response = await axios.post(`/lecturer/upload-resource/${lecturerId}`, formData, config);
      return response.data;
    },
    deleteResource: async (resourceId) => {
      const response = await axios.delete(`/lecturer/delete-resource/${resourceId}`);
      return response.data;
    },

    getAllResources: async (lecturerId) => {
      const response = await axios.get(`/lecturer/resources/${lecturerId}`);
      return response.data;
    },
    
    getAllAssignments: async (lecturerId) => {
      const response = await axios.get(`/lecturer/assignments/${lecturerId}`);
      return response.data;
    },
    
    getAllSubmissions: async (assignmentId) => {
      const response = await axios.get(`/lecturer/assignment-submissions/${assignmentId}`);
      return response.data;
    },
  
    downloadAllSubmissions: async (assignmentId) => {
      const response = await axios.post(`/lecturer/download-all-submissions/${assignmentId}`, {});
      return response.data;
    },
  };
  
  // Admin Dashboard
  const adminApi = {
    getAllUsers: async () => {
      const response = await axios.get('/admin/users');
      return response.data;
    },

    getAllLecturers: async () => {
      const response = await axios.get('/admin/lecturers');
      return response.data;
    },
  
    getUser: async (userId) => {
      const response = await axios.get(`/admin/user/${userId}`);
      return response.data;
    },
  
    editUser: async (userId, userData) => {
      const response = await axios.patch(`/admin/edit-user/${userId}`, userData);
      return response.data;
    },
  
    deleteUser: async (userId) => {
      const response = await axios.delete(`/admin/delete-user/${userId}`);
      return response.data;
    },
    getLecturer: async (lecturerId) => {
      const response = await axios.get(`/admin/lecturer/${lecturerId}`);
      return response.data;
    },
    editLecturer: async (lecturerId, lecturerData) => {
      const response = await axios.patch(`/admin/edit-lecturer/${lecturerId}`, lecturerData);
      return response.data;
    },
    deleteLecturer: async (lecturerId) => {
      const response = await axios.delete(`/admin/delete-lecturer/${lecturerId}`);
      return response.data;
    },
  };
  
  
  
  // Notifications
  const notificationApi = {
    getNotifications: async (studentId) => {
      const response = await axios.get(`/student/notifications/get/${studentId}`);
      return response.data;
    },
  
    postNotification: async (notificationData) => {
      const response = await axios.post(`/student/notifications/fetch`, notificationData);
      return response.data;
    },
    updateNotification: async (studentId) => {
      const response = await axios.patch(`/student/notifications/${studentId}`);
      return response.data;
    },
  };
  
  export {
    studentApi,
    lecturerApi,
    adminApi,
    profileApi,
    notificationApi,
  };