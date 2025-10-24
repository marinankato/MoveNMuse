// Shirley
import { PaymentDetail } from "../models/paymentDetail.model.js";
import Course from "../models/course.model.js";
import { CourseSession } from "../models/courseSession.model.js";

// error handler function
const handleError = (res, error) => {
  console.error("Error:", error);
  return res.status(500).json({ message: "Internal Server Error" });
};

// Read paymentDetail data, if paymentDetail not found, create a new paymentDetail
const readPaymentDetail = async (req, res) => {
  const userId = Number(req.query.userId);

  try {
    let paymentDetail = await PaymentDetail.find({ userId }).lean();

    return res.status(200).json(paymentDetail);
  } catch (error) {
    handleError(res, error);
  }
};

// Add a new paymentDetail
const addPaymentDetail = async (req, res) => {
  try {
    const {
      userId,
      cardBrand,
      name,
      nickname,
      cardNumber,
      cardSecurityCode,
      expiryMonth,
      expiryYear,
      isDefault,
    } = req.body || {};

    // Basic validation
    if (!userId || !cardBrand || !name || !cardNumber || !expiryMonth || !expiryYear) {
      return res.status(400).json({ message: "Missing required fields" });
    }



    let makeDefault = Boolean(isDefault);
    const existingCount = await PaymentDetail.countDocuments({ userId });
    if (existingCount === 0) makeDefault = true;

    if (makeDefault) {
      await PaymentDetail.updateMany(
        { userId, isDefault: true },
        { $set: { isDefault: false } }
      );
    }

    let paymentDetailId = 0;
    const lastPaymentDetail = await PaymentDetail.findOne().sort({ paymentDetailId: -1 });
    if (lastPaymentDetail) {
      paymentDetailId = lastPaymentDetail.paymentDetailId + 1;
    } else {
      paymentDetailId = 1; // start from 1 if no records exist
    }

    const doc = await PaymentDetail.create({
      paymentDetailId,
      userId,
      cardBrand,
      name,
      nickname,
      cardNumber,
      cardSecurityCode,
      expiryMonth,
      expiryYear,
      isDefault: makeDefault,
    });

res.status(201).json({
  paymentDetailId: doc.paymentDetailId,
  cardBrand: doc.cardBrand,
  nickname: doc.nickname,
  name: doc.name,
  cardNumber: doc.cardNumber,
  expiryMonth: doc.expiryMonth,
  expiryYear: doc.expiryYear,
  isDefault: doc.isDefault,
});
  } catch (err) {
    console.error("addPaymentDetail error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Remove a paymentDetail by paymentDetailId 
const removePaymentDetail = async (req, res) => {
  try {
    const rawPid = req.params.paymentDetailId;
    if (rawPid == null) {
      return res.status(400).json({ message: "paymentDetailId is required" });
    }


    const pid = Number(rawPid);
    if (!Number.isFinite(pid)) {
      return res.status(400).json({ message: "paymentDetailId must be a number" });
    }

    const deleted = await PaymentDetail.findOneAndDelete({ paymentDetailId: pid});
    if (!deleted) {
      return res.status(404).json({ message: "PaymentDetail not found" });
    }

    return res.status(200).json({ message: "PaymentDetail removed successfully" });
  } catch (error) {
    console.error("removePaymentDetailItem error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};



// Find paymentDetail contents for booking by paymentDetail id
const getPaymentDetailById = async (req, res) => {
  const paymentDetailId = Number(req.params.paymentDetailId);

  try {
    const paymentDetail = await PaymentDetail.findById(paymentDetailId);

    if (!paymentDetail) {
      return res.status(404).json({ message: "PaymentDetail not found" });
    }

    return res.status(200).json(paymentDetail);
  } catch (error) {
    handleError(res, error);
  }
};

// Set default payment detail
const setDefaultPaymentDetail = async (req, res) => {
  const { userId, paymentDetailId } = req.body;

  try {
    await PaymentDetail.updateMany(
      { userId, isDefault: true },
      { $set: { isDefault: false } }
    );

    const updated = await PaymentDetail.findOneAndUpdate(
      { userId, paymentDetailId },
      { $set: { isDefault: true } },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "PaymentDetail not found" });
    }

    return res.status(200).json({ message: "Default payment detail set successfully" });
  } catch (error) {
    handleError(res, error);
  }
}



export { readPaymentDetail, addPaymentDetail, removePaymentDetail, getPaymentDetailById,setDefaultPaymentDetail };
