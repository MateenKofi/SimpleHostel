// error-formatter.ts
import { Prisma } from "@prisma/client";
import { HttpStatus } from "./http-status";
import HttpException from "./http-error";

export const formatPrismaError = (error: unknown): HttpException => {
  // If it's already an HttpException, return it as is
  if (error instanceof HttpException) {
    return error;
  }

  // Handle Prisma known errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const cleanMessage = (message: string) =>
      message
        .replace(/\\n/g, "\n")
        .replace(/\s+at\s+.*\.ts:\d+:\d+/g, "")
        .replace(/Invocation:\n\n/, "")
        .trim();

    switch (error.code) {
      case "P2002": {
        const fields = error.meta?.target
          ? (error.meta.target as string[]).join(", ")
          : "field";
        return new HttpException(
          HttpStatus.CONFLICT,
          `Duplicate entry: The ${fields} already exists.`
        );
      }

      case "P2025":
        return new HttpException(
          HttpStatus.NOT_FOUND,
          "Record not found: The requested resource does not exist."
        );

      case "P2003": {
        // Extracting the specific field that caused the error
        const field = error.meta?.field_name || "unknown field";
        return new HttpException(
          HttpStatus.BAD_REQUEST,
          `Invalid reference: The provided value for '${field}' does not exist.`
        );
      }

      default:
        return new HttpException(
          HttpStatus.INTERNAL_SERVER_ERROR,
          `Database error: ${cleanMessage(error.message)}`
        );
    }
  }

  // Handle Prisma validation errors
  if (error instanceof Prisma.PrismaClientValidationError) {
    const lines = error.message.split("\n").map((line) => line.trim());

    // Look for specific error explanation
    const errorDetail = lines.find((line) =>
      line.includes("needs at least one") ||
      line.includes("is missing") ||
      line.includes("is invalid") ||
      line.includes("Unknown argument")
    );

    if (errorDetail) {
      // Handle "Unknown argument" case
      const unknownArgMatch = errorDetail.match(/Unknown argument `([^`]+)`. Did you mean `([^`]+)`?/);
      if (unknownArgMatch) {
        const [, invalidArg, suggestedArg] = unknownArgMatch;
        return new HttpException(
          HttpStatus.BAD_REQUEST,
          `Validation error: Invalid argument \`${invalidArg}\`. Did you mean \`${suggestedArg}\`?`
        );
      }

      // Handle "needs at least one" case
      const fieldMatch = errorDetail.match(/Argument `([^`]+)`/) || [];
      const fieldName = fieldMatch[1] || "unknown field";

      const requiredFieldsMatch = errorDetail.match(/needs at least one of ([^.]+)/);
      let requiredFields = "required arguments";
      if (requiredFieldsMatch && requiredFieldsMatch[1]) {
        requiredFields = requiredFieldsMatch[1]
          .trim()
          .split(/` or `/)
          .map((field) => field.replace(/`/g, "").trim())
          .filter(Boolean)
          .join(" or ");
      }

      if (fieldName !== "unknown field" && requiredFields !== "required arguments") {
        return new HttpException(
          HttpStatus.BAD_REQUEST,
          `Validation error: The \`${fieldName}\` field requires at least one of: ${requiredFields}.`
        );
      }

      // Fallback for other validation errors
      const cleanMessage = errorDetail
        .replace(/.*invocation in [^:]+:\d+:\d+\s*/, "") // Remove file path
        .replace(/Available options are marked with \?.*/, "") // Remove extra hints
        .replace(/Argument `[^`]+` of type \S+/, "") // Remove type info
        .trim();

      return new HttpException(
        HttpStatus.BAD_REQUEST,
        `Validation error: ${cleanMessage}`
      );
    }

    // Fallback to a concise version of the message
    const cleanMessage =
      lines
        .filter(
          (line) =>
            !line.includes("invocation in") &&
            !line.startsWith("→") &&
            line.length > 0
        )
        .join(" ")
        .trim() || "Invalid request format";

    return new HttpException(
      HttpStatus.BAD_REQUEST,
      `Validation error: ${cleanMessage}`
    );
  }

  // Handle other Prisma errors
  if (
    error instanceof Prisma.PrismaClientInitializationError ||
    error instanceof Prisma.PrismaClientRustPanicError
  ) {
    return new HttpException(
      HttpStatus.INTERNAL_SERVER_ERROR,
      "Database connection error. Please try again later."
    );
  }

  // Handle generic errors
  if (error instanceof Error) {
    if (error.name === "TimeoutError" || error.message.includes("Timeout")) {
      return new HttpException(HttpStatus.REQUEST_TIMEOUT, "The request timed out. Please check your connection.");
    }
    return new HttpException(HttpStatus.INTERNAL_SERVER_ERROR, error.message);
  }

  // Handle plain object errors (often from external SDKs like Cloudinary)
  if (typeof error === "object" && error !== null) {
    const errObj = error as any;
    const message = errObj.message || errObj.error?.message || "An unexpected error occurred.";
    const status = errObj.http_code || errObj.status || HttpStatus.INTERNAL_SERVER_ERROR;

    if (message.includes("Timeout") || status === 499 || status === 408) {
      return new HttpException(HttpStatus.REQUEST_TIMEOUT, "Gateway or Network Timeout. Please try again.");
    }

    return new HttpException(status, message);
  }

  // Fallback for unknown errors
  return new HttpException(
    HttpStatus.INTERNAL_SERVER_ERROR,
    "An unexpected error occurred."
  );
};
