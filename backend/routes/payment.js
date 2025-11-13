import express from "express";
import Razorpay from "razorpay";
import dotenv from "dotenv";
dotenv.config();

const paymentRouter = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

paymentRouter.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;
    const options = {
      amount: Math.round(Number(amount) * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };
    const order = await razorpay.orders.create(options);
    res.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID, // pass the key to frontend
    });
  } catch (error) {
    console.error("Razorpay error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default paymentRouter;
