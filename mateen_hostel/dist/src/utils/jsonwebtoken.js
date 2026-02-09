"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRole = exports.setInvalidToken = exports.signToken = exports.authenticateJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_error_1 = __importDefault(require("./http-error"));
const http_status_1 = require("./http-status");
const authenticateJWT = (req, res, next) => {
    const authHeader = req.header("Authorization");
    const token = authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(" ")[1];
    if (!token) {
        return next(new http_error_1.default(http_status_1.HttpStatus.FORBIDDEN, "No token found"));
    }
    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return next(new http_error_1.default(http_status_1.HttpStatus.FORBIDDEN, "Invalid token"));
        }
        if (decoded) {
            const user = decoded;
            req.user = user;
        }
        next();
    });
};
exports.authenticateJWT = authenticateJWT;
const signToken = (payload) => {
    const jwtSecret = process.env.JWT_SECRET;
    const jwtExpiresIn = process.env.JWT_EXPIRES_IN;
    if (!jwtSecret || !jwtExpiresIn) {
        throw new http_error_1.default(http_status_1.HttpStatus.INTERNAL_SERVER_ERROR, "JWT configuration is missing");
    }
    return jsonwebtoken_1.default.sign(payload, jwtSecret, {
        expiresIn: jwtExpiresIn,
    });
};
exports.signToken = signToken;
const setInvalidToken = () => {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        throw new http_error_1.default(http_status_1.HttpStatus.INTERNAL_SERVER_ERROR, "JWT secret is missing");
    }
    return jsonwebtoken_1.default.sign({ logout: "logout" }, jwtSecret, {
        expiresIn: "30s",
    });
};
exports.setInvalidToken = setInvalidToken;
const authorizeRole = (allowedRoles) => {
    return (req, res, next) => {
        const user = req.user;
        if (!user || !allowedRoles.includes(user.role)) {
            return next(new http_error_1.default(http_status_1.HttpStatus.FORBIDDEN, "Access denied"));
        }
        next();
    };
};
exports.authorizeRole = authorizeRole;
