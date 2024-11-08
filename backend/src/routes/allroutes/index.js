import express from "express";
import {
  // Lecturer APIs
  postLecturerUploadResourceRouteHandler,
  postLecturerSetAssignmentRouteHandler,
  getLecturerAssignmentsRouteHandler,
  getLecturerAssignmentSubmissionsRouteHandler,
  getLecturerResourcesRouteHandler,
  deleteLecturerDeleteResourceRouteHandler,
  // Student APIs
  getStudentCourseResourcesRouteHandler,
  getStudentCourseUnitResourcesRouteHandler,
  getStudentResourcesByTypeRouteHandler,
  postStudentSubmitAssignmentRouteHandler,
  getStudentAssignmentSubmissionsRouteHandler,
  getStudentGroupMembersRouteHandler,
  getStudentNotificationsRouteHandler,
  postStudentNotificationsRouteHandler,
  // Group APIs
  postGroupSubmitGroupAssignmentRouteHandler,
  // Admin APIs
  getAdminUsersRouteHandler,
  getAdminUserRouteHandler,
  patchAdminEditUserRouteHandler,
  deleteAdminDeleteUserRouteHandler,
  // Assignment APIs
  getAssignmentsRouteHandler,
  getAssignmentRouteHandler,
  postAssignmentSubmitRouteHandler,
  // Resource APIs
  getResourcesRouteHandler,
  getResourceRouteHandler,
  // Submission APIs
  getSubmissionsRouteHandler,
  getSubmissionRouteHandler,
  // Profile APIs
  getStudentProfileRouteHandler,
  getLecturerProfileRouteHandler,
  postLecturerDownloadAllSubmissionsRouteHandler,
} from "../../services/routelogic/index.js";

const router = express.Router();
// Lecturer Routes
router.post('/lecturer/upload-resource/:lecturerId', postLecturerUploadResourceRouteHandler);;
router.post('/lecturer/set-assignment/:lecturerId', postLecturerSetAssignmentRouteHandler);
router.get("/lecturer/assignments", getLecturerAssignmentsRouteHandler);
router.get("/lecturer/assignment-submissions/:assignmentId", getLecturerAssignmentSubmissionsRouteHandler);
router.get("/lecturer/resources", getLecturerResourcesRouteHandler);
router.delete("/lecturer/delete-resource/:resourceId", deleteLecturerDeleteResourceRouteHandler);

// Student Routes
router.get("/student/course-resources", getStudentCourseResourcesRouteHandler);
router.get("/student/courseunit-resources", getStudentCourseUnitResourcesRouteHandler);
router.get("/student/type-resources", getStudentResourcesByTypeRouteHandler);
router.post('/student/submit-assignment/:assignmentId/:studentId', postStudentSubmitAssignmentRouteHandler);
router.get("/student/assignment-submissions/:studentId", getStudentAssignmentSubmissionsRouteHandler);
router.get("/student/group-members", getStudentGroupMembersRouteHandler);
router.get("/student/notifications/get", getStudentNotificationsRouteHandler);
router.post("/student/notifications", postStudentNotificationsRouteHandler);


// Group Routes
router.post("/group/submit-group-assignment/:assignmentId", postGroupSubmitGroupAssignmentRouteHandler);

// Admin Routes
router.get("/admin/users", getAdminUsersRouteHandler);
router.get("/admin/user/:userId", getAdminUserRouteHandler);
router.patch("/admin/edit-user/:userId", patchAdminEditUserRouteHandler);
router.delete("/admin/delete-user/:userId", deleteAdminDeleteUserRouteHandler);

// Assignment Routes
router.get("/assignments", getAssignmentsRouteHandler);
router.get("/assignment/:assignmentId", getAssignmentRouteHandler);
router.post("/assignment/submit/:assignmentId", postAssignmentSubmitRouteHandler);

// Resource Routes
router.get("/resources", getResourcesRouteHandler);
router.get("/resource/:resourceId", getResourceRouteHandler);

// Submission Routes
router.get("/submissions", getSubmissionsRouteHandler);
router.get("/submission/:submissionId", getSubmissionRouteHandler);

// Profile Routes
router.get("/student/profile/:studentId", getStudentProfileRouteHandler);
router.get("/lecturer/profile/:lecturerId", getLecturerProfileRouteHandler);
router.post('/lecturer/download-all-submissions/:assignmentId', postLecturerDownloadAllSubmissionsRouteHandler);

export default router;