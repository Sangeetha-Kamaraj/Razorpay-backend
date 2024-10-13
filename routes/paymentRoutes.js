import express from "express";
import { body } from "express-validator";
import { createOrder, verifyPayment } from "../controllers/paymentController.js";

const router = express.Router();

// POST route to create an order with validation
router.post(
    "/createOrder",
    [
        body('amount').isNumeric().withMessage('Amount must be a number'),
        body('currency').isString().withMessage('Currency must be a string'),
    ],
    createOrder
);

// POST route to verify payment
router.post("/verifyPayment", verifyPayment);

// Export the router
export default router;
