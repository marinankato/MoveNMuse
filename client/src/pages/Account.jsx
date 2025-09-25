import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUser } from "../store/authSlice";
import { useEffect } from "react"; // If not already imported
import { Link } from "react-router-dom";

const Account = () => {
  const user = useSelector((state) => state.auth.userData);
  const dispatch = useDispatch(); 

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phoneNo: user?.phoneNo || "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [bookings, setBookings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalBookings, setTotalBookings] = useState(0);
  const limit = 5; // or however many bookings you want per page

  if (!user) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-3xl font-bold">My Account</h1>
        <p className="text-red-600 mt-4">Please log in to view your account details.</p>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage("");

    try {
        const response = await fetch("http://localhost:5173/api/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update account");
      }

      setMessage("Account updated successfully!");
      setEditMode(false);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async () => {
    if (editMode) {
      try {
        const res = await fetch("http://localhost:5001/api/user/update", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!res.ok) throw new Error("Failed to update user");

        const updatedUser = await res.json();

        dispatch(updateUser(updatedUser));

      } catch (err) {
        console.error(err);
        alert("Failed to save changes.");
      }
    }
    setEditMode((prev) => !prev);
  };

  useEffect(() => {
    // console.log("User ID:", user.id); 
    // to check current user's id
    if (!user) return;

    const fetchBookings = async () => {
      try {
        const res = await fetch(
          `http://localhost:5001/api/bookings?userId=${user.id}&page=${currentPage}&limit=${limit}`
        );

        const data = await res.json();

        setBookings(data.bookings);
        setTotalBookings(data.total);
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
      }
    };

    fetchBookings();
  }, [user, currentPage]);
  
  // const handleViewDetails = async (cartId) => {
  //   try {
  //     const res = await fetch(`http://localhost:5001/api/cart/${cartId}`);
  //     if (!res.ok) throw new Error("Failed to fetch cart details");

  //     const cart = await res.json();

  //     // For now, just log or alert the details
  //     console.log("Cart Details:", cart);
  //     alert(JSON.stringify(cart, null, 2)); // Just for quick testing

  //     // Later: show modal or navigate to detail view
  //   } catch (err) {
  //     console.error(err);
  //     alert("Could not load cart details");
  //   }
  // };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">My Account</h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        {message && (
          <div className="mb-4 text-center text-sm font-medium text-red-600">
            {message}
          </div>
        )}

        {/* Account Details Section */}
        <div className="space-y-4">
          {["firstName", "lastName", "email", "phoneNo"].map((field) => (
            <div key={field}>
              <label className="font-semibold capitalize block mb-1">
                {field === "phoneNo"
                  ? "Phone Number"
                  : field.replace(/([A-Z])/g, " $1")}:
              </label>
              {editMode ? (
                <input
                  type="text"
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              ) : (
                <p>{user[field] || "N/A"}</p>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-6">
          <button
            onClick={handleToggle}
            disabled={loading}
            className={`px-6 py-2 rounded text-white font-semibold transition ${
              editMode
                ? "bg-green-600 hover:bg-green-700"
                : "bg-blue-600 hover:bg-blue-700"
            } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {loading ? "Saving..." : editMode ? "Save" : "Edit"}
          </button>
        </div>
      </div>

      {/* Booking History Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mt-10">
        <h2 className="text-2xl font-bold mb-4">Booking History</h2>

        {bookings.length === 0 ? (
          <p className="text-gray-500">No bookings yet.</p>
        ) : (
          <ul className="space-y-4">
            {[...bookings]
              .sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate))
              .map((booking) => (
                <li
                  key={booking._id}
                  className="border-b pb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center"
                >
                  <div>
                    <p className="font-semibold text-blue-700">
                      Booking ID: #{booking._id}
                    </p>
                    <p className="text-sm text-gray-700">
                      Status: <span className="font-medium">{booking.status}</span>
                    </p>
                    <p className="text-sm text-gray-700">
                      Order Total: ${booking.orderTotal}
                    </p>
                    <p className="text-sm text-gray-700">
                      Order Date:{" "}
                      {new Date(booking.orderDate).toLocaleString("en-AU", {
                        dateStyle: "medium"
                      })}
                    </p><Link to={`/account/bookings/${booking._id}`} className="text-blue-600 hover:underline">
                      View Booking Details
                    </Link>
                  </div>
                </li>
              ))}
          </ul>
        )}
        
        {/* View More Button */}
        {bookings.length < totalBookings && (
          <div className="text-center mt-6">
            <button
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
            >
              View More
            </button>
          </div>
        )}
      </div>
    </div>
  );

};

export default Account;
