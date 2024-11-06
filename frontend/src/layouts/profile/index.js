import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import axios from "axios";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

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
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        let response;
        if (role === "lecturer") {
          response = await axios.get(`/lecturer/profile/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const lecturerData = response.data;
          setName(lecturerData.name);
          setEmail(lecturerData.email);
          setUserId(lecturerData.userId);
          setCourseunit(lecturerData.courseunit);
          setCourse(lecturerData.course);
          setPhone(lecturerData.phone);
        } else {
          response = await axios.get(`/student/profile/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const userData = response.data;
          setName(userData.name);
          setEmail(userData.email);
          setUserId(userData.userId);
          setCourse(userData.course);
          setGroup(userData.group);
          setIsGroupLeader(userData.isGroupLeader);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserProfile();
  }, [token, role, id]);

  const handleUpdatePhone = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let response;
      if (role === "lecturer") {
        response = await axios.patch(
          `/lecturer/${id}/phone`,
          { phone },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        response = await axios.patch(
          `/student/${id}/phone`,
          { phone },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
      if (response.status === 200) {
        alert("Phone number updated successfully");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  
    
    // Check if role is admin and return hardcoded profile
    if (role === 'admin') {
      return (
        <DashboardLayout>
      <DashboardNavbar />
        <div class="admin-profile-container">
        <h1 class="admin-profile-header">Admin Profile</h1>
        <div class="admin-profile-info">
          <h2 class="admin-name">Name: Administrator</h2>
          <p class="admin-email">Email: SasAdmin@gmail.com</p>
          <p class="admin-description">
            Welcome to the Admin Profile. This is the central hub for administrative information and updates. 
            Important notifications and emails will be sent to SasAdmin@gmail.com. 
            Please ensure to keep this email secure, as it receives sensitive information.
          </p>
        </div>
      </div>
      </DashboardLayout>
      );
    }
  


  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={10}>
          <Grid item xs="auto" lg={5}>
            <Card>
              <MDTypography variant="h5">Profile Information</MDTypography>
              <MDBox pt={2} px={2}>
                <MDTypography variant="button" color="text" fontWeight="regular">
                  Name: {name}
                </MDTypography>
                <MDTypography variant="button" color="text" fontWeight="regular">
                  Email: {email}
                </MDTypography>
                <MDTypography variant="button" color="text" fontWeight="regular">
                  User Id: {userId}
                </MDTypography>
                {role === "student" && (
                  <>
                    <MDTypography variant="button" color="text" fontWeight="regular">
                      Course: {course}
                    </MDTypography>
                    <MDTypography variant="button" color="text" fontWeight="regular">
                      Group: {group}
                    </MDTypography>
                    <MDTypography variant="button" color="text" fontWeight="regular">
                      Group Leader: {isGroupLeader ? "Yes" : "No"}
                    </MDTypography>
                  </>
                )}
                {role === "lecturer" && (
                  <>
                    <MDTypography variant="button" color="text" fontWeight="regular">
                      Course unit: {courseunit}
                    </MDTypography>
                    <MDTypography variant="button" color="text" fontWeight="regular">
                      Course: {course}
                    </MDTypography>
                  </>
                )}
              </MDBox>
            </Card>
          </Grid>
          <Grid item xs="auto" lg={6}>
            <Card>
              <MDTypography variant="h5">Contact Information</MDTypography>
              <MDBox pt={2} px={2}></MDBox>
              <MDInput
                    type="tel"
                    label="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  <MDButton
                    variant="gradient"
                    color="info"
                    onClick={handleUpdatePhone}
                    disabled={loading}
                  >
                    {loading ? "Updating..." : "Update Phone Number"}
                  </MDButton>
              
              </Card>
            </Grid>
          </Grid>
        </MDBox>
      </DashboardLayout>
    );
  };

  export default Profile;