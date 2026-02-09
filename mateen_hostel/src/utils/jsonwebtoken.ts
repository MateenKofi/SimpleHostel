import { Request, Response, NextFunction } from "express";
import jwt, { SignOptions } from "jsonwebtoken";
import HttpException from "./http-error";
import { HttpStatus } from "./http-status";

export interface UserPayload {
  id: string;
  role: string;
  hostelId?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.header("Authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return next(new HttpException(HttpStatus.FORBIDDEN, "No token found"));
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
    if (err) {
      return next(new HttpException(HttpStatus.FORBIDDEN, "Invalid token"));
    }

    if (decoded) {
      const user = decoded as UserPayload;
      req.user = user;
    }

    next();
  });
};

export const signToken = (payload: UserPayload): string => {
  const jwtSecret = process.env.JWT_SECRET;
  const jwtExpiresIn = process.env.JWT_EXPIRES_IN;

  if (!jwtSecret || !jwtExpiresIn) {
    throw new HttpException(
      HttpStatus.INTERNAL_SERVER_ERROR,
      "JWT configuration is missing"
    );
  }

  return jwt.sign(payload, jwtSecret, {
    expiresIn: jwtExpiresIn,
  } as SignOptions);
};

export const setInvalidToken = (): string => {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new HttpException(
      HttpStatus.INTERNAL_SERVER_ERROR,
      "JWT secret is missing"
    );
  }

  return jwt.sign({ logout: "logout" }, jwtSecret, {
    expiresIn: "30s",
  } as SignOptions);
};

export const authorizeRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = req.user;

    if (!user || !allowedRoles.includes(user.role)) {
      return next(new HttpException(HttpStatus.FORBIDDEN, "Access denied"));
    }

    next();
  };
};