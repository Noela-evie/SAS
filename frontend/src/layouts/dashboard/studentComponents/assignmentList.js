const AssignmentList = ({ assignments, userId, setNotifications }) => {
    const handleFileUpload = async (assignmentId, file) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', userId);
      
      await axios.post(`/api/assignments/${assignmentId}/submit`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      setNotifications((prev) => [...prev, { title: "Assignment Submitted", message: "Your assignment was submitted successfully!" }]);
    };
  
    return (
      <div>
        {assignments.map((assignment) => (
          <div key={assignment.id} className="assignment-item">
            <h3>{assignment.course}</h3>
            <p>Deadline: {assignment.deadlineDate}</p>
            <input type="file" onChange={(e) => handleFileUpload(assignment.id, e.target.files[0])} />
          </div>
        ))}
      </div>
    );
  };
  

export default AssignmentList;