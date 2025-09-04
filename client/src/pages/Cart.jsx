import { useEffect, useState } from "react";
import { CheckoutBtn } from "../utils/index.jsx";

function CartPage() {
  // const [user, setUser] = useState(null);
  const [cart, setCart] = useState(null);
  const [selectAll, setSelectAll] = useState(false);
  const [products, setProducts] = useState();
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingRemoveID, setPendingRemoveID] = useState(null);
  const userEmail = "alice@example.com";

  //load cart data when page first loads
  useEffect(() => {
    async function fetchCart() {
      const response = await fetch(`/api/cart?userEmail=${userEmail}`, {
        // credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        // Add isSelected field to each item
        const productsWithSelection = formatSelectedProducts(data);

        setCart(data);
        setProducts(productsWithSelection);
      } else {
        console.error("Failed to fetch cart");
      }
    }
    fetchCart();
  }, []);

  function formatSelectedProducts(cart) {
    const productsWithSelection = cart.items.map((item) => ({
      ...item,
      date: new Date(item.date).toLocaleDateString(),
      time: new Date(item.date).toLocaleTimeString(),
      isSelected: false,
    }));
    return productsWithSelection;
  }

  // Calculate subtotal of selected products
  const subtotal = (products || [])
    .filter((p) => p.isSelected)
    .reduce((sum, p) => sum + p.price, 0);

  // Toggle selection
  const handleCheckboxChange = (id) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.itemID === id ? { ...p, isSelected: !p.isSelected } : p
      )
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
  //remove one item
  const removeHandler = async (itemID) => {
    const response = await fetch(
      `/api/cart/item/${itemID}?cartID=${cart.cartID}`,
      { method: "DELETE" }
    );
    if (response.ok) {
      const data = await response.json();
      setCart(data.cart);
      setProducts((prev) => prev.filter((p) => itemID != p.itemID));
    } else {
      console.error("Failed to remove item");
    }

    // setProducts((prev) => prev.filter((p) => id != p.itemID));
  };

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold text-center mb-6">My Cart</h1>
      <div className="max-w-4xl mx-auto px-4">
        {showConfirm && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black/50" />
            <div className="bg-white rounded-2xl shadow-lg max-w-sm w-full p-6 relative z-10">
              <div>
                Are you sure you want to remove{" "}
                {products.find((p) => p.itemID === pendingRemoveID).name}?
              </div>
              <div className="flex justify-end gap-3">
                <button
                  className="mr-4 px-4 py-2 bg-red-500 text-white rounded"
                  onClick={() => {
                    removeHandler(pendingRemoveID);
                    setShowConfirm(false);
                    setPendingRemoveID(null);
                  }}
                >
                  Yes
                </button>
                <button
                  className="px-4 py-2 bg-gray-300 text-black rounded"
                  onClick={() => {
                    setShowConfirm(false);
                    setPendingRemoveID(null);
                  }}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}
        {!products || products.length === 0 ? (
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
                <tr key={p.itemID} className="border-b">
                  <td className="py-4 px-6">
                    <input
                      type="checkbox"
                      checked={p.isSelected}
                      onChange={() => handleCheckboxChange(p.itemID)}
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
                      onClick={() => (
                        setShowConfirm(true), setPendingRemoveID(p.itemID)
                      )}
                    >
                      X
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td
                  className="py-4 px-6 text-sm text-gray-900"
                  colSpan="3"
                >
                  {products.filter((p) => p.isSelected).length} /{" "}
                  {products.length} items selected
                </td>

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
                  ${subtotal}
                </td>
                <td
                  className="py-4 px-6 text-sm text-gray-900 font-bold"
                  colSpan="1"
                >
                  <CheckoutBtn />
                </td>
              </tr>
            </tfoot>
          </table>
        )}
      </div>
    </div>
  );
}

export default CartPage;
