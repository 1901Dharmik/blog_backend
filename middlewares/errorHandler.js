// not Found

const notFound = (req, res, next) => {
  const error = new Error(`Not Found : ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Error Handler - hide stack in production

const errorHandler = (error, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);

  let message = error?.message || "Internal Server Error";
  let validation = null;
  try {
    const parsed = JSON.parse(message);
    if (parsed && parsed.validation) {
      validation = parsed.validation;
      message = "Validation failed";
    }
  } catch (_) {}

  const payload = {
    status: "fail",
    message,
    ...(validation && { validation }),
  };
  if (process.env.NODE_ENV !== "production" && error?.stack) {
    payload.stack = error.stack;
  }

  res.json(payload);
};

export { errorHandler, notFound };