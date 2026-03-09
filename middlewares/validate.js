/**
 * Validation middleware - production-ready request validation without extra deps.
 * Validates presence and types; throws with 400 and clear message.
 */
const validate = (rules) => (req, res, next) => {
  const body = req.body || {};
  const errors = [];

  for (const [field, rule] of Object.entries(rules)) {
    const value = body[field];
    const { required, type, min, max, minLength, maxLength, enum: enumValues } = rule;

    if (required && (value === undefined || value === null || value === "")) {
      errors.push({ field, message: `${field} is required` });
      continue;
    }

    if (value === undefined || value === null) continue;

    // Coerce numeric string to number for type "number"
    if (type === "number" && typeof value === "string" && value.trim() !== "" && !Number.isNaN(Number(value))) {
      req.body[field] = Number(value);
      body[field] = Number(value);
    }
    const val = body[field];

    if (type === "string" && typeof val !== "string") {
      errors.push({ field, message: `${field} must be a string` });
    } else if (type === "number" && typeof val !== "number") {
      errors.push({ field, message: `${field} must be a number` });
    } else if (type === "boolean" && typeof val !== "boolean") {
      errors.push({ field, message: `${field} must be a boolean` });
    } else if (type === "objectId" && !/^[a-fA-F0-9]{24}$/.test(String(val))) {
      errors.push({ field, message: `${field} must be a valid ObjectId` });
    }

    if (type === "string" && typeof val === "string") {
      if (minLength != null && val.length < minLength)
        errors.push({ field, message: `${field} must be at least ${minLength} characters` });
      if (maxLength != null && val.length > maxLength)
        errors.push({ field, message: `${field} must be at most ${maxLength} characters` });
    }

    if (type === "number" && typeof val === "number") {
      if (min != null && val < min) errors.push({ field, message: `${field} must be at least ${min}` });
      if (max != null && val > max) errors.push({ field, message: `${field} must be at most ${max}` });
    }

    if (enumValues && !enumValues.includes(val)) {
      errors.push({ field, message: `${field} must be one of: ${enumValues.join(", ")}` });
    }
  }

  if (errors.length > 0) {
    res.status(400);
    return next(new Error(JSON.stringify({ validation: errors })));
  }
  next();
};

/** Slug generator from title */
export const slugify = (title) =>
  String(title)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-|-$/g, "");

export default validate;
