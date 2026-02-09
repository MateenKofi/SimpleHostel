"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes"));
const prisma_1 = __importDefault(require("./utils/prisma"));
const adminPanel_1 = require("./controller/adminPanel");
const http_error_1 = __importDefault(require("./utils/http-error"));
const http_status_1 = require("./utils/http-status");
// import * as swaggerDocs from './swagger.json'
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 2020;
app.use(express_1.default.json({
    verify: (req, res, buf) => {
        req.rawBody = buf.toString();
    },
}));
app.use(express_1.default.urlencoded({ extended: true })); // Ensure form-data is parsed properly
app.use((0, morgan_1.default)("dev"));
app.use((0, cors_1.default)({
    origin: ["http://localhost:5173", "http://localhost:2020", "https://simple-hostel.vercel.app"],
    credentials: true,
}));
app.get("/", (req, res) => {
    res.send("Express + TypeScript Server");
});
// app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))
const rateLimit_1 = require("./middleware/rateLimit");
app.use("/api", rateLimit_1.apiLimiter, routes_1.default);
app.use("/api/v1", rateLimit_1.apiLimiter, routes_1.default);
app.use("*", (req, res) => {
    console.log("Catch-all route hit!"); // Logs if an undefined route is hit
    res.status(404).json({
        message: "Route not found",
    });
});
app.use((error, req, res, next) => {
    console.log("error handler: ", error.status || 500, next);
    res.status(error.status || 500).json({
        status: error.status || 500,
        error: error.message,
    });
});
exports.default = app;
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, adminPanel_1.createSuperAdminUser)(); // Call the function to create the admin user
        if (process.env.NODE_ENV !== "production") {
            app.listen(port, () => {
                console.log(`[server]: Server is running at http://localhost:${port}`);
            });
        }
        else {
            // On Vercel, we call this to ensure the admin is created on the first request or deployment
            yield (0, adminPanel_1.createSuperAdminUser)();
        }
    }
    catch (error) {
        const err = error;
        throw new http_error_1.default(err.status || http_status_1.HttpStatus.INTERNAL_SERVER_ERROR, err.message || "Failed to start server");
    }
    finally {
        yield prisma_1.default.$disconnect(); // Ensure Prisma client disconnects
    }
});
// Only call startServer if this file is run directly (not as a module on Vercel)
if (require.main === module) {
    startServer();
}
else {
    // On Vercel, ensures admin is created
    (0, adminPanel_1.createSuperAdminUser)().catch(console.error);
}
