import { useNavigate } from "react-router-dom";

const CheckoutBtn = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/checkout");
  };

  return (
    <div>
      <button
        onClick={handleLoginClick}
        className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-200"
      >
        Checkout
      </button>
    </div>
  );
};

export default CheckoutBtn;
