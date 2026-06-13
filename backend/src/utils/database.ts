import fs from "fs";
import path from "path";
import { Database } from "../models/types";

const dbPath = path.join(__dirname, "../../db.json");

export function readDatabase(): Database {
  try {
    const data = fs.readFileSync(dbPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return { customers: [], orders: [] };
  }
}

export function writeDatabase(data: Database): void {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
