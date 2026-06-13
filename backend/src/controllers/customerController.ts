import { Request, Response } from "express";
import { readDatabase, writeDatabase, generateId } from "../utils/database";
import { Customer } from "../models/types";

export function addCustomer(req: Request, res: Response): void {
  try {
    const { name, email, phone } = req.body;

    const db = readDatabase();
    const newCustomer: Customer = {
      id: generateId(),
      name,
      email,
      phone,
      createdAt: new Date().toISOString(),
    };

    db.customers.push(newCustomer);
    writeDatabase(db);

    res.status(201).json({
      message: "Customer added successfully",
      customer: newCustomer,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to add customer" });
  }
}

export function getAllCustomers(req: Request, res: Response): void {
  try {
    const db = readDatabase();
    res.json(db.customers);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch customers" });
  }
}
