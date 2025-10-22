import { Payment } from "../models/payment.model.js";

// error handler function
const handleError = (res, error) => {
  console.error("Error:", error);
  return res.status(500).json({ message: "Internal Server Error" });
};

//Process a payment
const processPayment = async (req, res) => {
  try {
    const body = req.body || {};
    // pull raw values
    const rawOrderId = body.orderId;
    const rawAmount = body.amount;
    const rawUserId = body.userId;
    const rawPaymentDetailId = body.paymentDetailId;

    // Basic validation
    if (!rawOrderId || !rawAmount || !rawUserId || !rawPaymentDetailId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const orderId = Number(rawOrderId);
    const userId = Number(rawUserId);
    const amount = Number(rawAmount);
    const paymentDetailId = Number(rawPaymentDetailId);

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
};

// Get payment history
const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.aggregate([
      { $match: {} },
      {
        $lookup: {
          from: "paymentdetails",
          localField: "paymentDetailId",
          foreignField: "paymentDetailId",
          as: "paymentDetail",
        },
      },
      { $unwind: { path: "$paymentDetail", preserveNullAndEmptyArrays: true } },
      // Mask sensitive fields and shape the response
      {
        $project: {
          _id: 1,
          paymentId: 1,
          orderId: 1,
          status: 1,
          userId: 1,
          paymentDate: 1,
          createdAt: 1,
          updatedAt: 1,
          paymentDetailId: 1,
          amount: {
            $cond: [
              { $eq: [{ $type: "$amount" }, "decimal"] },
              { $toDouble: "$amount" },
              "$amount",
            ],
          },

          paymentDetail: {
            _id: "$paymentDetail._id",
            paymentDetailId: "$paymentDetail.paymentDetailId",
            cardBrand: "$paymentDetail.cardBrand",
            nickname: "$paymentDetail.nickname",
            name: "$paymentDetail.name",
            expiryMonth: "$paymentDetail.expiryMonth",
            expiryYear: "$paymentDetail.expiryYear",
            isDefault: "$paymentDetail.isDefault",
            // mask card number
            last4: {
              $cond: [
                { $ifNull: ["$paymentDetail.cardNumber", false] },
                {
                  $substr: [
                    "$paymentDetail.cardNumber",
                    {
                      $subtract: [
                        { $strLenCP: "$paymentDetail.cardNumber" },
                        4,
                      ],
                    },
                    4,
                  ],
                },
                null,
              ],
            },
          },
        },
      },
    ]);
    return res.status(200).json(payments);
  } catch (error) {
    handleError(res, error);
  }
};
// Get payment history by userId
const getPaymentHistoryById = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ message: "Missing userId" });
    }

    const payments = await Payment.aggregate([
      { $match: { userId: Number(userId) } },
      {
        $lookup: {
          from: "paymentdetails",
          localField: "paymentDetailId",
          foreignField: "paymentDetailId",
          as: "paymentDetail",
        },
      },
      { $unwind: { path: "$paymentDetail", preserveNullAndEmptyArrays: true } },
      // Mask sensitive fields and shape the response
      {
        $project: {
          _id: 1,
          paymentId: 1,
          orderId: 1,
          status: 1,
          userId: 1,
          paymentDate: 1,
          createdAt: 1,
          updatedAt: 1,
          paymentDetailId: 1,
          amount: {
            $cond: [
              { $eq: [{ $type: "$amount" }, "decimal"] },
              { $toDouble: "$amount" },
              "$amount",
            ],
          },

          paymentDetail: {
            _id: "$paymentDetail._id",
            paymentDetailId: "$paymentDetail.paymentDetailId",
            cardBrand: "$paymentDetail.cardBrand",
            nickname: "$paymentDetail.nickname",
            name: "$paymentDetail.name",
            expiryMonth: "$paymentDetail.expiryMonth",
            expiryYear: "$paymentDetail.expiryYear",
            isDefault: "$paymentDetail.isDefault",
            // mask card number
            last4: {
              $cond: [
                { $ifNull: ["$paymentDetail.cardNumber", false] },
                {
                  $substr: [
                    "$paymentDetail.cardNumber",
                    {
                      $subtract: [
                        { $strLenCP: "$paymentDetail.cardNumber" },
                        4,
                      ],
                    },
                    4,
                  ],
                },
                null,
              ],
            },
          },
        },
      },
    ]);
    return res.status(200).json(payments);
  } catch (error) {
    handleError(res, error);
  }
};

export { processPayment, getPaymentHistoryById, getAllPayments };
