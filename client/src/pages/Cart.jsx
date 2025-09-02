import { useState } from "react";
import { CheckoutBtn } from "../utils/index.jsx";

// import { set } from "mongoose";

function Cart() {
  const [selectAll, setSelectAll] = useState(false);
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Hip Hop Course",
      date: new Date("October 13, 2025 11:00").toLocaleDateString(),
      time: new Date("October 13, 2025 11:00").toLocaleTimeString(),
      price: 30.0,
      isSelected: false,
    },
    {
      id: 2,
      name: "Small Dance Room",
      date: new Date("October 15, 2025 12:00").toLocaleDateString(),
      time: new Date("October 15, 2025 12:00").toLocaleTimeString(),
      price: 50.0,
      isSelected: false,
    },
    {
      id: 3,
      name: "Medium Dance Room",
      date: new Date("October 18, 2025 09:00").toLocaleDateString(),
      time: new Date("October 18, 2025 09:00").toLocaleTimeString(),
      price: 60.0,
      isSelected: false,
    },
    {
      id: 4,
      name: "Large Dance Room",
      date: new Date("November 15, 2025 08:00").toLocaleDateString(),
      time: new Date("November 15, 2025 08:00").toLocaleTimeString(),
      price: 70.0,
      isSelected: false,
    },
    {
      id: 5,
      name: "Jeezy Dance Course",
      date: new Date("November 15, 2025 12:00").toLocaleDateString(),
      time: new Date("November 15, 2025 12:00").toLocaleTimeString(),
      price: 50.0,
      isSelected: false,
    },
  ]);

  // Calculate subtotal of selected products
  const subtotal = products
    .filter((p) => p.isSelected)
    .reduce((sum, p) => sum + p.price, 0);

  // Toggle selection
  const handleCheckboxChange = (id) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isSelected: !p.isSelected } : p))
    );
    setSelectAll(false);
  };
  // select all
  const handleSelectAllCheckboxChange = (id) => {
    setSelectAll(!selectAll);
    setProducts((prev) => {
      return prev.map((p) => ({ ...p, isSelected: !selectAll }));
    });
  };

  const removeHandler = (id) => {
    setProducts((prev) => prev.filter((p) => id != p.id));
  };

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold text-center mb-6">My Cart</h1>
      <div className="max-w-4xl mx-auto px-4">
        {products.length === 0 ? (
          <div className=" bg-white shadow-md rounded-lg p-6">
            <p className="text-center text-gray-600">Your cart is empty.</p>
          </div>
        ) : (
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={() => handleSelectAllCheckboxChange()}
                  />
                </th>
                <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">
                  Product
                </th>
                <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">
                  Date
                </th>
                <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">
                  Time
                </th>
                <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">
                  Price
                </th>

                <th className="py-3 px-6 text-left text-sm font-medium text-gray-700"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b">
                  <td className="py-4 px-6">
                    <input
                      type="checkbox"
                      checked={p.isSelected}
                      onChange={() => handleCheckboxChange(p.id)}
                    />
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-900">{p.name}</td>
                  <td className="py-4 px-6 text-sm text-gray-900">{p.date}</td>
                  <td className="py-4 px-6 text-sm text-gray-900">{p.time}</td>
                  <td className="py-4 px-6 text-sm text-gray-900">
                    ${p.price}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-900 text-center">
                    <button
                      className="text-red-600 hover:text-red-800 font-bold text-center"
                      onClick={() => removeHandler(p.id)}
                    >
                      X
                    </button>
                  </td>
                </tr>
              ))}
              <tr>
                <td
                  className="py-4 px-6 text-sm text-gray-900 font-bold"
                  colSpan="4"
                >
                  Subtotal
                </td>
                <td className="py-4 px-6 text-sm text-gray-900 font-bold">
                  ${subtotal}
                </td>
                <td className="py-4 px-6 text-sm text-gray-900 font-bold">
                  <CheckoutBtn />
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Cart;
