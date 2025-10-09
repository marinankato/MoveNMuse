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
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNo: "",
  });

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

    let errorMessage = "";

    if (name === "phoneNo") {
      const onlyDigits = value.replace(/\D/g, ""); // Remove non-digits
      if (onlyDigits.length > 10) {
        errorMessage = "Phone number must be exactly 10 digits.";
      } else if (onlyDigits.length < 10) {
        errorMessage = "Phone number must be exactly 10 digits.";
      }
      setFormData((prev) => ({ ...prev, [name]: onlyDigits }));
    } else if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      errorMessage = emailRegex.test(value) ? "" : "Invalid email format.";
      setFormData((prev) => ({ ...prev, [name]: value }));
    } else {
      if (value.trim() === "") {
        errorMessage = `${name === "firstName" ? "First name" : "Last name"} is required.`;
      }
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    setErrors((prev) => ({
      ...prev,
      [name]: errorMessage,
    }));
  };


  const handleSave = async () => {
    setLoading(true);
    setMessage("");
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required.";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format.";
    }

    if (!formData.phoneNo.trim()) {
      newErrors.phoneNo = "Phone number is required.";
    } else if (formData.phoneNo.length !== 10) {
      newErrors.phoneNo = "Phone number must be exactly 10 digits.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5001/api/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, 
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update account");
      }
      dispatch(updateUser(data.user));
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
      await handleSave(); 
    } else {
      setEditMode(true);
    }
  };

  useEffect(() => {
    const fetchUserProfileAndBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const profileRes = await fetch("http://localhost:5001/api/user/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!profileRes.ok) throw new Error("Failed to fetch profile");
        const profileData = await profileRes.json();
        dispatch(updateUser(profileData.user));

        const userId = profileData.user.id;

        const bookingsRes = await fetch(
          `http://localhost:5001/api/bookings?userId=${userId}&page=${currentPage}&limit=${limit}`
        );

        const data = await bookingsRes.json();
        setBookings(data.bookings);
        setTotalBookings(data.total);
      } catch (err) {
        console.error("Failed to fetch profile/bookings:", err.message);
      }
    };

    fetchUserProfileAndBookings();
  }, [currentPage]);


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
            <div key={field} className="mb-4">
              <label className="font-semibold capitalize block mb-1">
                {field === "phoneNo"
                  ? "Phone Number"
                  : field === "email"
                  ? "Email"
                  : field.replace(/([A-Z])/g, " $1")}
              </label>

              {editMode ? (
                <>
                  <input
                    type="text"
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                  {errors[field] && (
                    <p className="text-red-600 text-sm mt-1">{errors[field]}</p>
                  )}
                </>
              ) : (
                <p>{formData[field]}</p>
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
