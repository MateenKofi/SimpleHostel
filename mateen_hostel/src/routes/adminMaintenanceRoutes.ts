import { Router } from "express";
import * as adminMaintenanceController from "../controller/adminMaintenanceController";
import { authenticateJWT, authorizeRole } from "../utils/jsonwebtoken";

const adminMaintenanceRouter = Router();

// Apply authentication and check for admin/super_admin roles
adminMaintenanceRouter.use(authenticateJWT);
adminMaintenanceRouter.use(authorizeRole(["admin", "super_admin"]));

adminMaintenanceRouter.get("/", adminMaintenanceController.getAllMaintenanceRequestsController);
adminMaintenanceRouter.get("/stats", adminMaintenanceController.getMaintenanceStatsController);
adminMaintenanceRouter.patch("/:requestId", adminMaintenanceController.updateMaintenanceRequestController);

export default adminMaintenanceRouter;
