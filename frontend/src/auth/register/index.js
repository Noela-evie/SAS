import { useContext, useState } from "react";
// react-router-dom components
import { Link } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";

// Images
import bgImage from "assets/images/bg-sign-up-cover.jpg";

import { AuthContext } from "context";
import { InputLabel } from "@mui/material";

function Register() {
  const authContext = useContext(AuthContext);

  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    userId: "",
    password: "",
    course: "",
    groupname: "",
    isGroupLeader: false,
    agree: false,
  });
  
  const [errors, setErrors] = useState({
    nameError: false,
    emailError: false,
    userIdError: false,
    passwordError: false,
    courseError: false,
    groupnameError: false,
    isGroupLeaderError: false,
    agreeError: false,
    error: false,
    errorText: "",
  });

  const changeHandler = (e) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
    });
  }; 

  const submitHandler = async (e) => {
    e.preventDefault();

    const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    
    if (inputs.name.trim().length === 0) {
      setErrors({ ...errors, nameError: true });
      return;
    }

    if (inputs.userId.trim().length < 4 && userId.trim().length > 8) {
      setErrors({ ...errors, userIdError: true });
      return;
    }

    if (inputs.email.trim().length === 0 || !inputs.email.trim().match(mailFormat)) {
      setErrors({ ...errors, emailError: true });
      return;
    }

    if (inputs.course !== "BIST" && inputs.course !== "BSE" && inputs.course !== "CSC") {
      setErrors({ ...errors, courseError: true });
      return;
    }

      const groupNameRegex = /^Group [A-Z]$/i;
    if (!groupNameRegex.test(inputs.groupname.trim())) {
      setErrors({ ...errors, groupnameError: true });
      return;
    }

    if (!inputs.password.trim() || inputs.password.trim().length < 8) {
      setErrors({ ...errors, passwordError: true });
      return;
    }

    if (inputs.agree === false) {
      setErrors({ ...errors, agreeError: true });
      return;
    }

    // here will be the post action to add a user to the db

    const registerData = {
      name: inputs.name,
      email: inputs.email,
      userId: inputs.userId,
      password: inputs.password,
      course: inputs.course,
      groupname: inputs.groupname,
      isGroupLeader: inputs.isGroupLeader,
    };

    try {
      const response = await authContext.register(registerData);
      console.log("Response:", response);
      setInputs({
        name: "",
        email: "",
        userId: "",
        password: "",
        course: "",
        groupname: "",
        isGroupLeader: false,
        agree: false,
      });

      setErrors({
        nameError: false,
        emailError: false,
        userIdError: false,
        passwordError: false,
        courseError: false,
        groupnameError: false,
        isGroupLeaderError: false,
        agreeError: false,
        error: false,
        errorText: "",
      });
    } catch (err) {
      setErrors({ ...errors, error: true, errorText: err.message });
      console.error(err);
    }
  };

  return (
    <CoverLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="success"
          mx={2}
          mt={-3}
          p={3}
          mb={1}
          textAlign="center"
        >
          <MDTypography display="block" variant="button" color="white" my={1}>
            Enter your details to register
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" method="POST" onSubmit={submitHandler}>
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Name"
                variant="standard"
                fullWidth
                name="name"
                value={inputs.name}
                onChange={changeHandler}
                error={errors.nameError}
                inputProps={{
                  autoComplete: "name",
                  form: {
                    autoComplete: "off",
                  },
                }}
              />
              {errors.nameError && (
                <MDTypography variant="caption" color="error" fontWeight="light">
                  The name can not be empty
                </MDTypography>
              )}
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="email"
                label="Email"
                variant="standard"
                fullWidth
                value={inputs.email}
                name="email"
                onChange={changeHandler}
                error={errors.emailError}
                inputProps={{
                  autoComplete: "email",
                  form: {
                    autoComplete: "off",
                  },
                }}
              />
              {errors.emailError && (
                <MDTypography variant="caption" color="error" fontWeight="light">
                  The email must be valid
                </MDTypography>
              )}
            </MDBox>

            <MDBox mb={2}>
              <MDInput
                type="text"
                label="userId"
                variant="standard"
                fullWidth
                name="userId"
                value={inputs.userId}
                onChange={changeHandler}
                error={errors.userIdError}
                inputProps={{
                  autoComplete: "userId",
                  form: {
                    autoComplete: "off",
                  },
                }}
              />
              {errors.userIdError && (
                <MDTypography variant="caption" color="error" fontWeight="light">
                  The userId must have 14 characters
                </MDTypography>
              )}
            </MDBox>

            <MDBox mb={2}>
              <MDInput
                type="password"
                label="Password"
                variant="standard"
                fullWidth
                name="password"
                value={inputs.password}
                onChange={changeHandler}
                error={errors.passwordError}
              />
              {errors.passwordError && (
                <MDTypography variant="caption" color="error" fontWeight="light">
                  The password must be of at least 8 characters
                </MDTypography>
              )}
          </MDBox>

          <MDBox mb={2}>
            <MDInput
              type="text"
              label="Course"
              variant="standard"
              fullWidth
              name="course"
              value={inputs.course}
              onChange={changeHandler}
              error={errors.courseError}
            />
            {errors.courseError && (
                <MDTypography variant="caption" color="error" fontWeight="light">
                  The course is either BIST, BSE or CSC.
                </MDTypography>
              )}
            

                        <MDBox mb={2}>
              <MDTypography variant="button" color="text" fontWeight="regular">
                Enter Group Name
              </MDTypography>
              <MDInput
                type="text"
                name="groupname"
                value={inputs.groupname}
                onChange={changeHandler}
                error={errors.groupnameError}
              />
              {errors.groupnameError && (
                <MDTypography variant="caption" color="error" fontWeight="light">
                  Please enter a valid group name (e.g., Group A, Group B, etc.)
                </MDTypography>
              )}
            </MDBox>

                        <MDBox mb={2}>
              <MDTypography variant="button" color="text" fontWeight="regular">
                Are you a Group Leader?
              </MDTypography>
              <MDBox display="flex" alignItems="center" ml={-1}>
                <Checkbox
                  name="isGroupLeader"
                  checked={inputs.isGroupLeader}
                  onChange={changeHandler}
                />
              </MDBox>
              {errors.isGroupLeaderError && (
                <MDTypography variant="caption" color="error" fontWeight="light">
                  Please select an option
                </MDTypography>
              )}
            </MDBox>

            </MDBox>
            <MDBox display="flex" alignItems="center" ml={-1}>
              <Checkbox name="agree" id="agree" onChange={changeHandler} />
              <InputLabel
                variant="standard"
                fontWeight="regular"
                color="text"
                sx={{ lineHeight: "1.5", cursor: "pointer" }}
                htmlFor="agree"
              >
                &nbsp;&nbsp;I agree to the&nbsp;
              </InputLabel>
              <MDTypography
                component={Link}
                to="/auth/login"
                variant="button"
                fontWeight="bold"
                color="info"
                textGradient
              >
                Terms and Conditions
              </MDTypography>
            </MDBox>
            {errors.agreeError && (
              <MDTypography variant="caption" color="error" fontWeight="light">
                You must agree to the Terms and Conditions
              </MDTypography>
            )}
            {errors.error && (
              <MDTypography variant="caption" color="error" fontWeight="light">
                {errors.errorText}
              </MDTypography>
            )}
            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" color="info" fullWidth type="submit">
                sign in
              </MDButton>
            </MDBox>
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Already have an account?{" "}
                <MDTypography
                  component={Link}
                  to="/auth/login"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Sign In
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </CoverLayout>
  );
}

export default Register;
