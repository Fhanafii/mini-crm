import express from "express";
import { addCustomer, getAllCustomers } from "../controllers/customerController";
import { validateCustomer } from "../middleware/validation";

const router = express.Router();

router.post("/", validateCustomer, addCustomer);
router.get("/", getAllCustomers);

export default router;
