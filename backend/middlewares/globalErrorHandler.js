// middlewares/globalErrorHandler.js
import { AppError } from "../utils/customErrorHandler/customError.js";

export const globalErrorHandler = (err, req, res, next) => {
  const isProd = process.env.NODE_ENV === "production";

  if (err instanceof AppError) {
    return res.status(err.status).json({
      success: false,
      code: err.code,
      message: err.message,
      details: isProd ? null : err.details,
    });
  }

  console.error("Unexpected error:", err);

  res.status(500).json({
    success: false,
    code: "INTERNAL_ERROR",
    message: isProd ? "Something went wrong!" : err.message,
    details: isProd ? null : err.stack,
  });
};
