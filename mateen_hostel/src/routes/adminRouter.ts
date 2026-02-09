import { Router } from "express";
import { clearDatabase } from "../controller/adminPanel";
import { authenticateJWT, authorizeRole } from "../utils/jsonwebtoken";
const adminRouter = Router();
adminRouter.use(authenticateJWT);
adminRouter.use(authorizeRole(["super_admin"]));
adminRouter.post(
  "/clear-database",

  clearDatabase,
);

export default adminRouter;
