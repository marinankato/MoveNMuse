// Shirley
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/index.jsx";
import PaymentMethodForm from "../components/PaymentMethodForm.jsx";

export default function Payment() {
  const { state } = useLocation();

  const booking = state?.booking || null;
  const subtotal = state?.booking.orderTotal || 0;
  const userId = state?.userId || 0;
  const navigate = useNavigate();
  const [paymentDetails, setPaymentDetails] = useState([]);
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  // load payment methods on mount
  useEffect(() => {
    (async () => {
      setLoading(true);

      const data = await api.getPaymentDetails(userId);
      const list = Array.isArray(data) ? data : data ? [data] : [];
      setPaymentDetails(list);
      setSelectedPaymentId(
        list.find((p) => p.isDefault)?.paymentDetailId ??
          list[0]?.paymentDetailId ??
          null
      );
      setLoading(false);
    })();
  }, []);

  const maskLast4 = (n) =>
    typeof n === "string" && n.length >= 4 ? n.slice(-4) : "••••";

  // create new payment method
  async function createPaymentDetail(payload) {
    setSaving(true);
    setSaveError("");
    try {
      const res = await fetch("/api/paymentDetail/addPaymentDetail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, userId }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const created = await res.json();
      setPaymentDetails((prev) => [created, ...prev]);
      setSelectedPaymentId(created.paymentDetailId);
      setShowAddForm(false);
    } catch (e) {
      setSaveError(e.message || "Failed to save card.");
    } finally {
      setSaving(false);
    }
  }

  // handle payment submission
  async function handlePayNow(e) {
    e.preventDefault();
    try {
      const res = await fetch("/api/payment/processPayment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: booking.orderId,
          amount: booking.orderTotal,
          userId: userId,
          paymentDetailId: selectedPaymentId,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const result = await res.json();
      navigate("/paymentSuccess", {
        state: { booking, payment: result.payment },
      });
    } catch (e) {
      alert("Payment failed: " + (e.message || "Unknown error"));
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <h1 className="text-3xl font-bold text-center mb-6">Payment Methods</h1>
       <div className="max-w-4xl mx-auto px-4">
      {loading || paymentDetails === null ? (
        <div className="bg-white shadow-md rounded-lg p-6">
          <p className="text-center text-gray-600 animate-pulse">
            Loading your cart…
          </p>
        </div>
      ): !paymentDetails.length ? (
          <div className="bg-white shadow-md rounded-lg p-6">
            <p className="text-center text-gray-600">You do not have any saved card yet.</p>
          </div>
        ) : (
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white shadow-md rounded-lg p-6">
            {/* Selection form */}
            <form onSubmit={handlePayNow}>
              <fieldset>
                <legend className="sr-only">Choose a payment method</legend>

                <div className="relative">
                  {paymentDetails.map((p) => (
                    <div className="mb-2" key={p.paymentDetailId}>
                      <input
                        type="radio"
                        name="paymentMethodId"
                        id={`pm-${p.paymentDetailId}`}
                        value={p.paymentDetailId}
                        className="hidden peer"
                        checked={selectedPaymentId === p.paymentDetailId}
                        onChange={() => setSelectedPaymentId(p.paymentDetailId)}
                      />
                      <label
                        htmlFor={`pm-${p.paymentDetailId}`}
                        className="inline-flex items-center justify-between w-full p-5 bg-white border-2 rounded-lg cursor-pointer group border-neutral-200/70 text-neutral-600 peer-checked:border-blue-400 peer-checked:text-neutral-900 peer-checked:bg-blue-200/50 hover:text-neutral-900 hover:border-neutral-300"
                      >
                        <div className="flex items-center space-x-5">
                          {String(p.cardBrand)
                            .toLowerCase()
                            .includes("visa") ? (
                            <img className="w-20" src="visa.svg" alt="Visa" />
                          ) : (
                            <img
                              className="w-20"
                              src="mastercard-logo.png"
                              alt="Mastercard"
                            />
                          )}
                          <div className="flex flex-col justify-start">
                            <div className="w-full text-lg font-semibold">
                              **** **** **** {maskLast4(p.cardNumber)}
                            </div>
                            <div className="w-full text-sm opacity-60">
                              Expires {String(p.expiryMonth).padStart(2, "0")}/
                              {p.expiryYear}
                            </div>
                            {p.nickname && (
                              <div className="w-full text-xs opacity-60">
                                {p.nickname}
                              </div>
                            )}
                          </div>
                        </div>
                      </label>
                    </div>
                  ))}
                </div>

                <div className="mt-6 border-t pt-4">
                  <div className="flex items-center justify-between text-neutral-700">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex justify-center mt-6">
                  <button
                    type="button"
                    onClick={handlePayNow}
                    className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition"
                  >
                    Pay Now
                  </button>
                </div>
              </fieldset>
            </form>
          </div>
          <div className="bg-white mt-5 shadow-md rounded-lg p-6">
            <div className="mt-3">
              <button
                type="button"
                onClick={() => setShowAddForm((s) => !s)}
                className="inline-flex items-center justify-between w-full p-5 bg-gray-50 border-2 rounded-lg cursor-pointer"
              >
                {showAddForm ? "Hide form" : "Add a new card"}
              </button>
            </div>
            {showAddForm && (
              <PaymentMethodForm
                onSubmit={createPaymentDetail}
                onCancel={() => setShowAddForm(false)}
                saving={saving}
                error={saveError}
              />
            )}
          </div>
        </div>
        
      )}
    </div>
    </div>
  );
}
