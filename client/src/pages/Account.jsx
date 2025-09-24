import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUser } from "../store/authSlice";

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
      // const response = await fetch("/api/user/update", {
        fetch("http://localhost:5173/api/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          // include credentials or token if needed
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update account");
      }

      // Optionally update user in Redux store
      // dispatch(updateUserData(data));

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

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center">My Account</h1>

      {message && (
        <div className="mb-4 text-center text-sm font-medium text-red-600">
          {message}
        </div>
      )}

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
  );
};

export default Account;
