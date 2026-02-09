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
const visitorController = __importStar(require("../controller/visitorController")); // Assuming your controller file is named visitorController
const jsonwebtoken_1 = require("../utils/jsonwebtoken");
const AccessControl_1 = require("../utils/AccessControl");
const validate_payload_1 = require("../middleware/validate-payload");
const visitorRouter = (0, express_1.Router)();
// Add a new visitor
visitorRouter.post("/add", jsonwebtoken_1.authenticateJWT, (0, jsonwebtoken_1.authorizeRole)(["super_admin", "admin"]), (0, validate_payload_1.validatePayload)("Visitor"), AccessControl_1.validateHostelAccess, visitorController.addVisitorController);
// Get all visitors
visitorRouter.get("/get", jsonwebtoken_1.authenticateJWT, (0, jsonwebtoken_1.authorizeRole)(["super_admin",]), visitorController.getAllVisitorsController);
// Get a visitor by ID
visitorRouter.get("/get/:visitorId", jsonwebtoken_1.authenticateJWT, (0, jsonwebtoken_1.authorizeRole)(["super_admin", "admin"]), AccessControl_1.validateHostelAccess, visitorController.getVisitorByIdController);
// Update a visitor's details
visitorRouter.put("/update/:visitorId", jsonwebtoken_1.authenticateJWT, (0, jsonwebtoken_1.authorizeRole)(["super_admin", "admin"]), AccessControl_1.validateHostelAccess, visitorController.updateVisitorController);
// Delete a visitor
visitorRouter.delete("/delete/:visitorId", jsonwebtoken_1.authenticateJWT, (0, jsonwebtoken_1.authorizeRole)(["super_admin", "admin"]), AccessControl_1.validateHostelAccess, visitorController.deleteVisitorController);
// Checkout a visitor
visitorRouter.put("/checkout/:visitorId", jsonwebtoken_1.authenticateJWT, (0, jsonwebtoken_1.authorizeRole)(["super_admin", "admin"]), AccessControl_1.validateHostelAccess, visitorController.checkoutVisitorController);
visitorRouter.get("/hostel/:hostelId", jsonwebtoken_1.authenticateJWT, (0, jsonwebtoken_1.authorizeRole)(["super_admin", "admin"]), AccessControl_1.validateHostelAccess, visitorController.visitorForHostel);
exports.default = visitorRouter;
