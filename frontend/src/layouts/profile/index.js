import React, { useState, useEffect } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { profileApi } from "../../appClient";

const Profile = () => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const id = localStorage.getItem('id');

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [course, setCourse] = useState("");
  const [group, setGroup] = useState("");
  const [isGroupLeader, setIsGroupLeader] = useState(false);
  const [courseunit, setCourseunit] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        let response;
        if (role === "lecturer") {
          response = await profileApi.getLecturerProfile(id);
        } else {
          response = await profileApi.getStudentProfile(id);
        }
        const userData = response;
        setName(userData.name);
        setEmail(userData.email);
        setUserId(userData.userId);
        setCourse(userData.course);
        if (role === "student") {
          setGroup(userData.groupname);
          setIsGroupLeader(userData.isGroupLeader);
        } else {
          setCourseunit(userData.courseunit);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserProfile();
  }, [token, role, id]);

  // Check if role is admin and return hardcoded profile
  if (role === 'admin') {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <div className="admin-profile-container p-4 mb-6 border-2 border-blue-500 rounded-lg">
          <h1 className="admin-profile-header text-2xl font-bold text-blue-500 mb-2">Admin Profile</h1>
          <div className="admin-profile-info">
            <h2 className="admin-name text-lg">Name: Administrator</h2>
            <p className="admin-email text-lg">Email: SasAdmin@gmail.com</p>
            <p className="admin-description text-lg">
              Welcome to the Admin Profile. This is the central hub for administrative information and updates.
              Important notifications and emails will be sent to SasAdmin@gmail.com. Please ensure to keep this email secure,
              as it receives sensitive information.
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div className="container mx-auto p-4 md:p-6 lg:p-8">
        <section className="p-4 mb-6 border-2 border-blue-500 rounded-lg">
          <h2 className="text-2xl font-bold text-blue-500 mb-2">Profile Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-blue-50 rounded-lg shadow-md p-4">
              <p className="text-lg">
                <b>Name:</b> {name}
              </p>
              <p className="text-lg">
                <b>Email:</b> {email}
              </p>
              <p className="text-lg">
                <b>User Id:</b> {userId}
              </p>
            </div>
            {role === "student" && (
              <div className="bg-blue-50 rounded-lg shadow-md p-4">
                <p className="text-lg">
                  <b>Course:</b> {course}
                </p>
                <p className="text-lg">
                  <b>Group:</b> {groupname}
                </p>
                <p className="text-lg">
                  <b>Group Leader:</b> {isGroupLeader ? "Yes" : "No"}
                </p>
              </div>
            )}
            {role === "lecturer" && (
              <div className="bg-blue-50 rounded-lg shadow-md p-4">
                <p className="text-lg">
                  <b>Course unit:</b> {courseunit}
                </p>
                <p className="text-lg">
                  <b>Course:</b> {course}
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default Profile;

