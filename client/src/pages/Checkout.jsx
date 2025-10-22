import { ProceedToPaymentBtn } from "../utils/index.jsx";
import { BackToCartBtn } from "../utils/index.jsx";
import { useLocation } from "react-router-dom";

// import { set } from "mongoose";

function Checkout() {
  const { state } = useLocation();
  const userId = state?.userId;
  const items = state?.selectedItems;
  const bookingItems = items.map((p) => ({
    itemId: p.itemId,
    productID: p.productId,
    productType: p.productType,
    occurrenceId: p.occurrenceId,
  }));;
  const subtotal = state?.subtotal;
  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <h1 className="text-3xl font-bold text-center mb-6">Order Summary</h1>
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white shadow-md rounded-lg p-6">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">
                  Product
                </th>
                <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">
                  Date & Time
                </th>
                <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">
                  Duration
                </th>
                <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">
                  Price
                </th>

                <th className="py-3 px-6 text-left text-sm font-medium text-gray-700"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.itemId} className="border-b">
                  <td className="py-4 px-6 text-sm text-gray-900">{p.product.courseName || p.product.name }</td>
                  <td className="py-4 px-6 text-sm text-gray-900">{new Date(p.occurrence.startTime).toISOString().slice(0, 16).replace("T", " ")}</td>
                  <td className="py-4 px-6 text-sm text-gray-900">{p.occurrence.duration} min</td>
                  <td className="py-4 px-6 text-sm text-gray-900">
                    ${p.occurrence.price.$numberDecimal}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-900 text-center"></td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td
                  className="py-4 px-6 text-sm text-gray-900 font-bold"
                  colSpan="2"
                ></td>
                <td
                  className="py-4 px-6 text-sm text-gray-900 font-bold"
                  colSpan="1"
                >
                  Subtotal
                </td>
                <td
                  className="py-4 px-6 text-sm text-gray-900 font-bold"
                  colSpan="1"
                >
                  ${subtotal.toFixed(2)}
                </td>

              </tr>
            </tfoot>
          </table>
          <div className="mt-6 text-center">
            <div>
              <BackToCartBtn />
              <ProceedToPaymentBtn bookingItems={bookingItems} subtotal={subtotal} userId={userId} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
