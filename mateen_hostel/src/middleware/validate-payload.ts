import { RequestHandler, Request, Response, NextFunction } from "express";
import allowedFields from "../../allowedFields.json";
import { HttpStatus } from "../utils/http-status";

export const validatePayload = (model: string): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
   
    // Find model fields from allowedFields.json
    const modelFields = allowedFields.find((field) => field.modelName === model);

    // If model is not found, reject the request
    if (!modelFields) {
      res.status(HttpStatus.BAD_REQUEST).json({
        message: `Model "${model}" is not recognized.`,
      });
      return; // 🔥 Ensure no further execution
    }

    const payload = req.body;
    const dataFields = Object.keys(payload);
   
    // Find any fields that are not part of the allowed fields
    const unwantedFields = dataFields.filter((field) => !modelFields.fields.includes(field));

    // If there are unwanted fields, reject the request
    if (unwantedFields.length > 0) {
    
      res.status(HttpStatus.BAD_REQUEST).json({
        message: "Invalid request format. The following fields are not allowed:",
        fields: unwantedFields,
      });
      return; 
    }
   
    next(); // ✅ Proceed if everything is fine
  };
};
