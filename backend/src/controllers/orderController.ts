import { Request, Response } from "express";
import { readDatabase, writeDatabase, generateId } from "../utils/database";
import { Order } from "../models/types";

export function addOrder(req: Request, res: Response): void {
  try {
    const { customerId, items, totalPrice } = req.body;

    const db = readDatabase();

    // Check if customer exists
    const customerExists = db.customers.some((c) => c.id === customerId);
    if (!customerExists) {
      res.status(404).json({ error: "Customer not found" });
      return;
    }

    const newOrder: Order = {
      id: generateId(),
      customerId,
      items,
      totalPrice,
      createdAt: new Date().toISOString(),
    };

    db.orders.push(newOrder);
    writeDatabase(db);

    res.status(201).json({
      message: "Order added successfully",
      order: newOrder,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to add order" });
  }
}

export function getOrdersByCustomer(req: Request, res: Response): void {
  try {
    const { customerId } = req.query;

    if (!customerId || typeof customerId !== "string") {
      res.status(400).json({ error: "customerId query parameter is required" });
      return;
    }

    const db = readDatabase();

    // Check if customer exists
    const customerExists = db.customers.some((c) => c.id === customerId);
    if (!customerExists) {
      res.status(404).json({ error: "Customer not found" });
      return;
    }

    const orders = db.orders.filter((o) => o.customerId === customerId);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
}
