import { Request, Response, NextFunction } from "express";

export function validateCustomer(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { name, email, phone } = req.body;

  if (!name || typeof name !== "string" || name.trim() === "") {
    res.status(400).json({ error: "Name is required and must be a string" });
    return;
  }

  if (!email || typeof email !== "string" || !email.includes("@")) {
    res.status(400).json({ error: "Valid email is required" });
    return;
  }

  if (!phone || typeof phone !== "string" || phone.trim() === "") {
    res.status(400).json({ error: "Phone is required and must be a string" });
    return;
  }

  next();
}

export function validateOrder(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { customerId, items, totalPrice } = req.body;

  if (!customerId || typeof customerId !== "string") {
    res.status(400).json({ error: "customerId is required and must be a string" });
    return;
  }

  if (!Array.isArray(items) || items.length === 0) {
    res.status(400).json({ error: "items must be a non-empty array" });
    return;
  }

  for (const item of items) {
    if (
      !item.name ||
      !item.quantity ||
      !item.price ||
      typeof item.quantity !== "number" ||
      typeof item.price !== "number"
    ) {
      res
        .status(400)
        .json({
          error: "Each item must have name, quantity, and price",
        });
      return;
    }
  }

  if (
    typeof totalPrice !== "number" ||
    totalPrice <= 0
  ) {
    res.status(400).json({ error: "totalPrice must be a positive number" });
    return;
  }

  next();
}
