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
  const [NIN, setNIN] = useState("");
  const [phone, setPhone] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [department, setDepartment] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        let response;
        if (role === "doctor") {
          response = await axios.get(`/doctors/${id}/profile`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const doctorData = response.data;
          setName(doctorData.name);
          setEmail(doctorData.email);
          setNIN(doctorData.NIN);
          setPhone(doctorData.phone);
          setSpecialty(doctorData.specialty);
          setDepartment(doctorData.department);
        } else {
          response = await axios.get(`/users/${id}/profile`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const userData = response.data;
          setName(userData.name);
          setEmail(userData.email);
          setNIN(userData.NIN);
          setPhone(userData.phone);
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
      if (role === "doctor") {
        response = await axios.patch(
          `/doctors/${id}/phone`,
          { phone },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        response = await axios.patch(
          `/users/${id}/phone`,
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
                  NIN: {NIN}
                </MDTypography>
                {role === "doctor" && (
                  <>
                    <MDTypography
                      variant="button"
                      color="text"
                      fontWeight="regular"
                    >
                      Specialty: {specialty}
                    </MDTypography>
                    <MDTypography
                      variant="button"
                      color="text"
                      fontWeight="regular"
                    >
                      Department: {department}
                    </MDTypography>
                  </>
                )}
              </MDBox>
            </Card>
          </Grid>
          <Grid item xs="auto" lg={6}>
            <Card>
              <MDTypography variant="h5">Contact Information</MDTypography>
              <MDBox pt={2} px={2}>
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
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
};

export default Profile;