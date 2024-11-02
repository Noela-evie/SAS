import express from "express";
import {
  postAppointmentRouteHandler,
  getAppointmentRouteHandler,
  getAppointmentsRouteHandler,
  getAllAppointmentsRouteHandler,
  postEventRouteHandler,
  getEventRouteHandler,
  getEventsRouteHandler,
  deleteEventRouteHandler,
  getDoctorProfileRouteHandler,
  getUserProfileRouteHandler,
  patchUserPhoneRouteHandler,
  patchDoctorPhoneRouteHandler,
  patchAppointmentStatusRouteHandler,
  patchAppointmentStatusToSuccessfulRouteHandler,
} from "../../services/routelogic/index.js";

const router = express.Router();

// Appointments
router.post("/appointments", postAppointmentRouteHandler);
router.get("/appointments/:id", getAppointmentRouteHandler);
router.get("/appointments", getAppointmentsRouteHandler);
router.get("/appointments/all", getAllAppointmentsRouteHandler);

// Events
router.post("/events", postEventRouteHandler);
router.get("/events/:doctorId", getEventRouteHandler);
router.get("/events", getEventsRouteHandler);
router.delete("/events/:eventId", deleteEventRouteHandler);

// Doctor Profile
router.get("/doctors/:doctorId/profile", getDoctorProfileRouteHandler);
router.get("/users/:userId/profile", getUserProfileRouteHandler);

// Patch Routes
router.patch("/users/:userId/phone", patchUserPhoneRouteHandler);
router.patch("/doctors/:doctorId/phone", patchDoctorPhoneRouteHandler);
router.patch("/appointments/:appointmentId/status", patchAppointmentStatusRouteHandler);
router.patch("/appointments/:appointmentId/status/successful", patchAppointmentStatusToSuccessfulRouteHandler);

export default router;