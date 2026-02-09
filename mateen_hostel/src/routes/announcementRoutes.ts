import { Router } from "express";
import * as announcementController from "../controller/announcementController";
import { authenticateJWT, authorizeRole } from "../utils/jsonwebtoken";
import { validatePayload } from "../middleware/validate-payload";

const announcementRouter = Router();

announcementRouter.use(authenticateJWT);
announcementRouter.use(authorizeRole(["super_admin", "admin"]));

announcementRouter.post(
    "/add",
    validatePayload("Announcement"),
    announcementController.addAnnouncementController
);

announcementRouter.patch(
    "/:announcementId",
    announcementController.updateAnnouncementController
);

announcementRouter.delete(
    "/:announcementId",
    announcementController.deleteAnnouncementController
);

export default announcementRouter;
