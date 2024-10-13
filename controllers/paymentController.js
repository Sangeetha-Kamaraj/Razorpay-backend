import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
import Order from "../models/orderModel.js";; // Import the Order model

dotenv.config();

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Order
export const createOrder = async (req, res) => {
    const { amount, currency } = req.body;

    const options = {
        amount: amount * 100,
        currency: currency || "INR",
        receipt: `receipt_${Date.now()}`
    };

    try {
        const order = await razorpayInstance.orders.create(options);
        // Save order in DB (optional)
        await Order.create({
            orderId: order.id,
            amount,
            currency,
            status: "created"
        });
        res.status(200).json(order);
    } catch (error) {
        console.error("Error while creating Razorpay order: ", error);
        res.status(500).json({ error: "Failed to create Razorpay order", details: error });
    }
};

// Verify Payment
export const verifyPayment = (req, res) => {
    const { order_id, payment_id, razorpay_signature } = req.body;
    const body = order_id + "|" + payment_id;

    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
        res.status(200).json({ message: "Payment verified successfully" });
    } else {
        res.status(400).json({ message: "Invalid payment signature" });
    }
};
