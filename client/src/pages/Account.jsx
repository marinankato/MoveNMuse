import React, { useState } from "react";
import { useSelector } from "react-redux";

const Account = () => {
  const user = useSelector((state) => state.auth.userData);

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phoneNo: user?.phoneNo || "",
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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleToggle = () => {
    if (editMode) {
      // Later, you'd add an API call here to save the changes
      alert("Changes saved (not really, just in local state for now)");
    }
    setEditMode((prev) => !prev);
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center">My Account</h1>

      <div className="space-y-4">
        {["firstName", "lastName", "email", "phoneNo"].map((field) => (
          <div key={field}>
            <label className="font-semibold capitalize block mb-1">
              {field === "phoneNo" ? "Phone Number" : field.replace(/([A-Z])/g, " $1")}:
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
          className={`px-6 py-2 rounded text-white font-semibold transition ${
            editMode ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {editMode ? "Save" : "Edit"}
        </button>
      </div>
    </div>
  );
};

export default Account;
