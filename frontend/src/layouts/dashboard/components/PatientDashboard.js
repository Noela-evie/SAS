import React, { useState, useEffect } from "react";
// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar";
// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

const PatientDashboard = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [reason, setReason] = useState("");
  const [department, setDepartment] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [successSB, setSuccessSB] = useState(false);
  const [errorSB, setErrorSB] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [bookedAppointments, setBookedAppointments] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch("/doctors");
        const data = await response.json();
        setDoctors(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchDoctors();
  }, []);

  useEffect(() => {
    const fetchBookedAppointments = async () => {
      try {
        const response = await fetch("/appointments/booked");
        const data = await response.json();
        setBookedAppointments(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchBookedAppointments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/appointments/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          reason,
          department,
          date,
          time,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setSuccessSB(true);
      } else {
        setErrorSB(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancel = async (appointmentId) => {
    try {
      const response = await fetch(`/appointments/cancel/${appointmentId}`, {
        method: "PATCH",
      });
      const data = await response.json();
      if (data.success) {
        setBookedAppointments((prevAppointments) =>
          prevAppointments.filter((appointment) => appointment._id !== appointmentId)
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mt={6} mb={3}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} lg={8}>
            <Card>
              <MDBox p={2}>
                <MDTypography variant="h5">Book an Appointment</MDTypography>
              </MDBox>
              <MDBox pt={2} px={2}>
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <MDTypography variant="button" color="text" fontWeight="regular">
                        Name
                      </MDTypography>
                      <MDBox mb={2}>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Name"
                          style={{ width: "100%", padding: "10px" }}
                        />
                      </MDBox>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <MDTypography variant="button" color="text" fontWeight="regular">
                        Email
                      </MDTypography>
                      <MDBox mb={2}>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Email"
                          style={{ width: "100%", padding: "10px" }}
                        />
                     <Grid item xs={12} sm={6}>
  <MDTypography variant="button" color="text" fontWeight="regular">
    Phone
  </MDTypography>
  <MDBox mb={2}>
    <input
      type="tel"
      value={phone}
      onChange={(e) => setPhone(e.target.value)}
      placeholder="Phone"
      style={{ width: "100%", padding: "10px" }}
    />
  </MDBox>
</Grid>
<Grid item xs={12} sm={6}>
  <MDTypography variant="button" color="text" fontWeight="regular">
    Reason
  </MDTypography>
  <MDBox mb={2}>
    <textarea
      value={reason}
      onChange={(e) => setReason(e.target.value)}
      placeholder="Reason"
      style={{ width: "100%", padding: "10px", resize: "none" }}
      rows="4"
    />
  </MDBox>
</Grid>
                      </MDBox>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <MDTypography variant="button" color="text" fontWeight="regular">
                        Department
                      </MDTypography>
                      <MDBox mb={2}>
                        <select
                          value={department}
                          onChange={(e) => setDepartment(e.target.value)}
                          style={{ width: "100%", padding: "10px" }}
                        >
                          <option value="">Select Department</option>
                          {doctors.map((department) => (
                            <option key={department._id} value={department.name}>
                              {department.name}
                            </option>
                          ))}
                        </select>
                      </MDBox>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <MDTypography variant="button" color="text" fontWeight="regular">
                        Date(Cannot be a weekend)
                      </MDTypography>
                      <MDBox mb={2}>
                        <input
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          style={{ width: "100%", padding: "10px" }}
                        />
                      </MDBox>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <MDTypography variant="button" color="text" fontWeight="regular">
                        Time
                      </MDTypography>
                      <MDBox mb={2}>
                        <select
                          value={time}
                          onChange={(e) => setTime(e.target.value)}
                          style={{ width: "100%", padding: "10px" }}
                        >
                          <option value="">Select Time</option>
                          <option value="8-10am">8am-10am</option>
                          <option value="10am-1pm">10am-1pm</option>
                          <option value="2-4pm">2pm-4pm</option>
                        </select>
                      </MDBox>
                    </Grid>
                    <Grid item xs={12}>
                      <MDButton type="submit" variant="gradient" color="success">
                        Book Appointment
                      </MDButton>
                    </Grid>
                  </Grid>
                </form>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} lg={8}>
            <Card>
              <MDBox p={2}>
                <MDTypography variant="h5">Booked Appointments</MDTypography>
              </MDBox>
              <MDBox pt={2} px={2}>
                {bookedAppointments.map((appointment) => (
                  <div key={appointment._id}>
                    <MDTypography variant="button" color="text" fontWeight="regular">
                      {appointment.doctor.name} - {appointment.date} - {appointment.time}
                    </MDTypography>
                    {new Date(appointment.date) > new Date() && (
                      <MDButton
                        variant="gradient"
                        color="error"
                        onClick={() => handleCancel(appointment._id)}
                      >
                        Cancel
                      </MDButton>
                    )}
                  </div>
                ))}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      {successSB && (
        <MDSnackbar
          color="success"
          icon="check"
          title="Appointment Booked"
          content="Your appointment has been booked successfully"
          dateTime="now"
          open={successSB}
          onClose={() => setSuccessSB(false)}
          close={() => setSuccessSB(false)}
          bgWhite
        />
      )}
      {errorSB && (
        <MDSnackbar
          color="error"
          icon="warning"
          title="Error"
          content="This time slot is unavailable, please choose a different day or time"
          dateTime="now"
          open={errorSB}
          onClose={() => setErrorSB(false)}
          close={() => setErrorSB(false)}
          bgWhite
        />
      )}
    </DashboardLayout>
  );
};

export default PatientDashboard;
