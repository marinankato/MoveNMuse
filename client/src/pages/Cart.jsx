import { useState } from "react";

function Cart() {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Product 1",
      time: "2 hours",
      price: 10,
      total: 20,
      isSelected: false,
    },
    {
      id: 2,
      name: "Product 2",
      time: "1 hour",
      price: 15,
      total: 15,
      isSelected: false,
    },
  ]);

  // Calculate subtotal of selected products
  const subtotal = products
    .filter((p) => p.isSelected)
    .reduce((sum, p) => sum + p.total, 0);

  // Toggle selection
  const handleCheckboxChange = (id) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isSelected: !p.isSelected } : p))
    );
  };

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold text-center mb-6">My Cart</h1>
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="py-3 px-6 text-left text-sm font-medium text-gray-700"></th>
            <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">
              Product
            </th>
            <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">
              Start Time
            </th>
            <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">
              Price
            </th>
            <th className="py-3 px-6 text-left text-sm font-medium text-gray-700">
              Total
            </th>
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
              <td className="py-4 px-6 text-sm text-gray-900">{p.time}</td>
              <td className="py-4 px-6 text-sm text-gray-900">${p.price}</td>
              <td className="py-4 px-6 text-sm text-gray-900">${p.total}</td>
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
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Cart;
