import express from "express";
import { addOrder, getOrdersByCustomer } from "../controllers/orderController";
import { validateOrder } from "../middleware/validation";

const router = express.Router();

router.post("/", validateOrder, addOrder);
router.get("/", getOrdersByCustomer);

export default router;
