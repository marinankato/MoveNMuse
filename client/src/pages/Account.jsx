import React from "react";
import { useSelector } from "react-redux";

const Account = () => {
  const user = useSelector((state) => state.auth.userData);

  if (!user) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-3xl font-bold">My Account</h1>
        <p className="text-red-600 mt-4">Please log in to view your account details.</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center">My Account</h1>
      <div className="space-y-4">
        <div>
          <label className="font-semibold">First Name:</label>
          <p>{user.firstName || "N/A"}</p>
        </div>
        <div>
          <label className="font-semibold">Last Name:</label>
          <p>{user.lastName || "N/A"}</p>
        </div>
        <div>
          <label className="font-semibold">Email:</label>
          <p>{user.email || "N/A"}</p>
        </div>
        <div>
          <label className="font-semibold">Phone Number:</label>
          <p>{user.phoneNo || "N/A"}</p>
        </div>
      </div>
    </div>
  );
};

export default Account;
