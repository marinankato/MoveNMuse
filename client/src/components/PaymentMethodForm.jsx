import { useState } from "react";

export default function PaymentMethodForm({
  initialValues = {},
  onSubmit,
  onCancel,
  saving = false,
  error = "",
}) {
  const [localError, setLocalError] = useState("");

  function validate(p) {
    if (!p.cardBrand) return "Please choose a card brand.";
    if (!p.name) return "Name on card is required.";
    if ((p.cardNumber || "").replace(/\s+/g, "").length < 12)
      return "Card number looks invalid.";
    if (!(Number(p.expiryMonth) >= 1 && Number(p.expiryMonth) <= 12))
      return "Expiry month must be 1–12.";
    if (String(p.expiryYear).length !== 4)
      return "Use a 4-digit year (e.g., 2027).";
    return "";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLocalError("");
    const fd = new FormData(e.currentTarget);
    const payload = {
      cardBrand: fd.get("cardBrand"),
      name: fd.get("name"),
      nickname: fd.get("nickname") || undefined,
      cardNumber: (fd.get("cardNumber") || "").replace(/\s+/g, ""),
      cardSecurityCode: fd.get("cardSecurityCode"),
      expiryMonth: Number(fd.get("expiryMonth")),
      expiryYear: Number(fd.get("expiryYear")),
      isDefault: false,
    };
    const msg = validate(payload);
    if (msg) return setLocalError(msg);
    await onSubmit?.(payload);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 border rounded-lg p-4"
      noValidate
    >
      <div className="md:col-span-2">
        <label className="block text-sm font-medium mb-1">Card brand</label>
        <select
          name="cardBrand"
          className="w-full border rounded-lg p-2"
          defaultValue={initialValues.cardBrand || ""}
          required
        >
          <option value="" disabled>
            Select brand
          </option>
          <option value="Visa">Visa</option>
          <option value="Mastercard">Mastercard</option>
        </select>
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium mb-1">Name on card</label>
        <input
          name="name"
          className="w-full border rounded-lg p-2"
          placeholder="Full name"
          defaultValue={initialValues.name || ""}
          required
        />
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium mb-1">Card number</label>
        <input
          name="cardNumber"
          inputMode="numeric"
          autoComplete="cc-number"
          className="w-full border rounded-lg p-2"
          placeholder="4111 1111 1111 1111"
          defaultValue={initialValues.cardNumber || ""}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Expiry month</label>
        <input
          name="expiryMonth"
          type="number"
          min="1"
          max="12"
          className="w-full border rounded-lg p-2"
          placeholder="MM"
          defaultValue={initialValues.expiryMonth || ""}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Expiry year</label>
        <input
          name="expiryYear"
          type="number"
          className="w-full border rounded-lg p-2"
          placeholder="YYYY"
          defaultValue={initialValues.expiryYear || ""}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">CVV</label>
        <input
          name="cardSecurityCode"
          type="password"
          inputMode="numeric"
          autoComplete="cc-csc"
          className="w-full border rounded-lg p-2"
          placeholder="123"
          defaultValue={initialValues.cardSecurityCode || ""}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Nickname (optional)
        </label>
        <input
          name="nickname"
          className="w-full border rounded-lg p-2"
          placeholder="Personal Visa"
          defaultValue={initialValues.nickname || ""}
        />
      </div>

      {(error || localError) && (
        <div className="md:col-span-2 text-red-600 text-sm">
          {error || localError}
        </div>
      )}

      <div className="md:col-span-2 flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save card"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded-lg"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
