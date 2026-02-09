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
const amenitiesController = __importStar(require("../controller/amenitiesController"));
const validate_payload_1 = require("../middleware/validate-payload"); // Optional: for payload validation
const jsonwebtoken_1 = require("../utils/jsonwebtoken");
const amenitiesRoute = (0, express_1.Router)();
// Add an amenity (POST request)
amenitiesRoute.post("/add", (0, validate_payload_1.validatePayload)("Amenities"), // Optional: Assuming you have a validation schema for adding amenities
jsonwebtoken_1.authenticateJWT, amenitiesController.addAmenityController);
// Get all amenities (GET request)
amenitiesRoute.get("/get", jsonwebtoken_1.authenticateJWT, (0, jsonwebtoken_1.authorizeRole)(["super_admin"]), amenitiesController.getAllAmenitiesController);
// Get a specific amenity by ID (GET request)
amenitiesRoute.get("/get/:amenityId", jsonwebtoken_1.authenticateJWT, (0, jsonwebtoken_1.authorizeRole)(["super_admin", "admin"]), amenitiesController.getAmenityByIdController);
// Update an amenity by ID (PUT request)
amenitiesRoute.put("/update/:amenityId", (0, validate_payload_1.validatePayload)("Amenities"), // Optional: Assuming you have a validation schema for updating amenities
jsonwebtoken_1.authenticateJWT, (0, jsonwebtoken_1.authorizeRole)(["super_admin", "admin"]), amenitiesController.updateAmenityController);
// Delete an amenity by ID (DELETE request)
amenitiesRoute.delete("/delete/:amenityId", jsonwebtoken_1.authenticateJWT, (0, jsonwebtoken_1.authorizeRole)(["super_admin", "admin"]), amenitiesController.deleteAmenityController);
amenitiesRoute.get("/hostel/:hostelId", jsonwebtoken_1.authenticateJWT, (0, jsonwebtoken_1.authorizeRole)(["super_admin", "admin"]), amenitiesController.getAmenitiesForHostel);
exports.default = amenitiesRoute;
