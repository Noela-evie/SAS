 // Material Dashboard 2 React layouts
 import Dashboard from "layouts/dashboard";
 import Notifications from "layouts/notifications";
 import Profile from "layouts/profile";
 import SignIn from "layouts/authentication/sign-in";
 import SignUp from "layouts/authentication/sign-up";
 
 import Login from "auth/login";
 import Register from "auth/register";
 import ForgotPassword from "auth/forgot-password";
 import ResetPassword from "auth/reset-password";
 
 // @mui icons
 import Icon from "@mui/material/Icon";
 
 const routes = [
   {
     type: "collapse",
     name: "Dashboard",
     key: "dashboard",
     icon: <Icon fontSize="small">dashboard</Icon>,
     route: "/dashboard",
     component: <Dashboard />,
   },
   {
     type: "collapse",
     name: "Notifications",
     key: "notifications",
     icon: <Icon fontSize="small">notifications</Icon>,
     route: "/notifications",
     component: <Notifications />,
   },
   {
     type: "collapse",
     name: "Profile",
     key: "profile",
     icon: <Icon fontSize="small">person</Icon>,
     route: "/profile",
     component: <Profile />,
   },
   {
     type: "collapse",
     name: "Sign In",
     key: "sign-in",
     icon: <Icon fontSize="small">login</Icon>,
     route: "/authentication/sign-in",
     component: <Login/>,
   },
   {
     type: "collapse",
     name: "Sign Up",
     key: "sign-up",
     icon: <Icon fontSize="small">assignment</Icon>,
     route: "/authentication/sign-up",
     component: <Register />,
   },
   {
     type: "auth",
     name: "Login",
     key: "login",
     icon: <Icon fontSize="small">login</Icon>,
     route: "/auth/login",
     component: <Login />,
   },
   {
     type: "auth",
     name: "Register",
     key: "register",
     icon: <Icon fontSize="small">reigster</Icon>,
     route: "/auth/register",
     component: <Register />,
   },
   {
     type: "auth",
     name: "Forgot Password",
     key: "forgot-password",
     icon: <Icon fontSize="small">assignment</Icon>,
     route: "/auth/forgot-password",
     component: <ForgotPassword />,
   },
   {
     type: "auth",
     name: "Reset Password",
     key: "reset-password",
     icon: <Icon fontSize="small">assignment</Icon>,
     route: "/auth/reset-password",
     component: <ResetPassword />,
   },
  
];

export default routes;
 
 