import { Router } from "express";
import * as roomController from "../controller/roomController"; // Assuming your controller file is named roomController
import upload from "../utils/multer";
import { authenticateJWT, authorizeRole } from "../utils/jsonwebtoken";
import { validateHostelAccess } from "../utils/AccessControl";
import { validatePayload } from "../middleware/validate-payload";

const roomRouter = Router();

// Get all rooms
roomRouter.get(
  "/get",
  authenticateJWT,
  authorizeRole(["super_admin"]),
  roomController.getAllRoomsController
);

// Get a room by ID
roomRouter.get(
  "/get/:roomId",
  authenticateJWT,
  authorizeRole(["super_admin", "admin"]),
  validateHostelAccess,

  roomController.getRoomByIdController
);

// Create a new room
roomRouter.post(
  "/add",
  upload.array("photos"),
  authenticateJWT,
  authorizeRole(["super_admin", "admin"]),
  validateHostelAccess,

  roomController.addRoomController
);

// Update an existing room
roomRouter.put(
  "/update/:roomId",
  upload.array("photos"),
  authenticateJWT,
  authorizeRole(["super_admin", "admin"]),
  validateHostelAccess,

  roomController.updateRoomController
);

// Update an existing room
roomRouter.put(
  "/updateall/:roomId",
  upload.array("photos"),
  authenticateJWT,
  authorizeRole(["super_admin", "admin"]),
  validateHostelAccess,

  roomController.updateRoomControllerAll
);

// Delete a room
roomRouter.delete(
  "/delete/:roomId",
  authenticateJWT,
  authorizeRole(["super_admin", "admin"]),
  validateHostelAccess,

  roomController.deleteRoomController
);

// Get available rooms
roomRouter.get(
  "/available",
  authenticateJWT,
  authorizeRole(["super_admin", "admin"]),
  validateHostelAccess,

  roomController.getAvailableRoomsController
);

roomRouter.post(
  "/:roomId/add",
  authenticateJWT,
  authorizeRole(["super_admin"]),
  validateHostelAccess,

  roomController.addAmenitiesToRoomController
);
roomRouter.post(
  "/:roomId/remove",
  authenticateJWT,
  authorizeRole(["super_admin", "admin"]),
  validateHostelAccess,

  roomController.removeAmenitiesFromRoomController
);

roomRouter.get(
  "/get/hostel/:hostelId",
  

  roomController.roomsForHostel
);
export default roomRouter;
