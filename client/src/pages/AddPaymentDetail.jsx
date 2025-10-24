// Shirley
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function AddPaymentDetail() {
  const { state } = useLocation();
    const navigate = useNavigate();
  const [paymentDetail, setPaymentDetail] = useState([]);
  const userId = 1;


  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <h1 className="text-3xl font-bold text-center mb-6">Add Card</h1>
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white shadow-md rounded-lg p-6">
          <form action="">
            <fieldset>
              <br />
              <div className="relative">
                
              </div>
              <div>
                <button
                onClick={() => navigate("/addPaymentDetail", { state })}
                  className="inline-flex items-center justify-between w-full p-5  bg-gray-50 border-2 rounded-lg cursor-pointer group "
                >Add a new card</button>
              </div>
              <div className="flex justify-center mt-6">
                <button className="px-6 py-2 mt-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-200">
                  <input type="submit" value="Continue" />
                </button>
              </div>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddPaymentDetail;
