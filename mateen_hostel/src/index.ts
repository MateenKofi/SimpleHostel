import express, { Express, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import mainRouter from "./routes";
import prisma from "./utils/prisma";
import { createSuperAdminUser } from "./controller/adminPanel";
import { ErrorResponse } from "./utils/types";
import HttpException from "./utils/http-error";
import { HttpStatus } from "./utils/http-status";
// import * as swaggerDocs from './swagger.json'
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 2020;
app.use(
  express.json({
    verify: (req: any, res, buf) => {
      req.rawBody = buf.toString();
    },
  })
);
app.use(express.urlencoded({ extended: true })); // Ensure form-data is parsed properly

app.use(morgan("dev"));
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:2020", "https://simple-hostel.vercel.app"],
    credentials: true,
  })
);
app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

// app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

import { apiLimiter } from "./middleware/rateLimit";

app.use("/api", apiLimiter, mainRouter);
app.use("/api/v1", apiLimiter, mainRouter);

app.use("*", (req: Request, res: Response) => {
  console.log("Catch-all route hit!"); // Logs if an undefined route is hit
  res.status(404).json({
    message: "Route not found",
  });
});
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  console.log("error handler: ", error.status || 500, next);
  res.status(error.status || 500).json({
    status: error.status || 500,
    error: error.message,
  });
});

export default app;

const startServer = async () => {
  try {
    await createSuperAdminUser(); // Call the function to create the admin user
    if (process.env.NODE_ENV !== "production") {
      app.listen(port, () => {
        console.log(`[server]: Server is running at http://localhost:${port}`);
      });
    } else {
      // On Vercel, we call this to ensure the admin is created on the first request or deployment
      await createSuperAdminUser();
    }
  } catch (error) {
    const err = error as ErrorResponse;
    throw new HttpException(
      err.status || HttpStatus.INTERNAL_SERVER_ERROR,
      err.message || "Failed to start server",
    );
  } finally {
    await prisma.$disconnect(); // Ensure Prisma client disconnects
  }
};

// Only call startServer if this file is run directly (not as a module on Vercel)
if (require.main === module) {
  startServer();
} else {
  // On Vercel, ensures admin is created
  createSuperAdminUser().catch(console.error);
}
