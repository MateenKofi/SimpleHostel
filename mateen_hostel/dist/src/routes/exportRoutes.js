"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jsonwebtoken_1 = require("../utils/jsonwebtoken"); // Authentication middleware
const AccessControl_1 = require("../utils/AccessControl"); // Hostel access validation middleware
const exportController = __importStar(require("../controller/exportController"));
const exportRouter = (0, express_1.Router)();
// export residents
exportRouter.get("/residents/:hostelId", jsonwebtoken_1.authenticateJWT, (0, jsonwebtoken_1.authorizeRole)(["super_admin", "admin"]), AccessControl_1.validateHostelAccess, exportController.exportResidentsCsv);
// export amenities
exportRouter.get("/amenities/:hostelId", jsonwebtoken_1.authenticateJWT, (0, jsonwebtoken_1.authorizeRole)(["super_admin", "admin"]), AccessControl_1.validateHostelAccess, exportController.exportAmenitiesCsv);
// export rooms
exportRouter.get("/rooms/:hostelId", jsonwebtoken_1.authenticateJWT, (0, jsonwebtoken_1.authorizeRole)(["super_admin", "admin"]), AccessControl_1.validateHostelAccess, exportController.exportRoomCsv);
// export visitor
exportRouter.get("/visitors/:hostelId", jsonwebtoken_1.authenticateJWT, (0, jsonwebtoken_1.authorizeRole)(["super_admin", "admin"]), AccessControl_1.validateHostelAccess, exportController.exportVisitorCsv);
// export payments
exportRouter.get("/payments/:hostelId", jsonwebtoken_1.authenticateJWT, (0, jsonwebtoken_1.authorizeRole)(["super_admin", "admin"]), AccessControl_1.validateHostelAccess, exportController.exportPaymentCsv);
// export stafss
exportRouter.get("/staffs/:hostelId", jsonwebtoken_1.authenticateJWT, (0, jsonwebtoken_1.authorizeRole)(["super_admin", "admin"]), AccessControl_1.validateHostelAccess, exportController.exportStaffCsv);
exports.default = exportRouter;
