// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// Dashboard role-based components
import DoctorDashboard from "layouts/dashboard/components/DoctorDashboard";
import AdminDashboard from "layouts/dashboard/components/AdminDashboard";
import PatientDashboard from "layouts/dashboard/components/PatientDashboard";

// Import the useAuth hook to access the user role
import { useAuth } from "context/index"; 
function Dashboard() {
  const { role } = useAuth(); 
  console.log("Role:", role);

  // Render specific dashboard based on role
  const renderDashboard = () => {
    if (role === "doctor") return <DoctorDashboard />;
    if (role === "admin") return <AdminDashboard />;
    if (role === "patient") return <PatientDashboard />;
    return <p>Unauthorized: Role not recognized.</p>; 
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          {renderDashboard()}
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default Dashboard;
