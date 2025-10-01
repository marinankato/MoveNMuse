import { Payment } from "../models/payment.model.js";

// error handler function
const handleError = (res, error) => {
  console.error("Error:", error);
  return res.status(500).json({ message: "Internal Server Error" });
};
const processPayment = async (req, res) => {
  try {
    const { orderId, amount, userId, paymentDetailId } = req.body || {};

    // Basic validation
    if (!orderId || !amount || !userId || !paymentDetailId) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const lastPayment = await Payment.findOne().sort({ paymentId: -1 });
    const newPaymentId = lastPayment ? lastPayment.paymentId + 1 : 1;

    const newPayment = new Payment({
      paymentId: newPaymentId,
      orderId,
      amount,
      status: "Successful",
      userId,
      paymentDetailId,
      paymentDate: new Date(),
    });

    await newPayment.save();
    res.status(201).json({ message: "Payment processed", payment: newPayment });
  } catch (error) {
    handleError(res, error);
  }
}

export { processPayment };
