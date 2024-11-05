import React from 'react';
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

function Reminders() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
    <MDBox sx={{ padding: 3, height: '100%' }}>
      <MDTypography variant="h5" fontWeight="medium">
        Reminders
      </MDTypography>
      <MDTypography variant="body2" color="text.secondary">
        This section is under development.
      </MDTypography>
    </MDBox>
    </DashboardLayout>
  );
}
export default Reminders