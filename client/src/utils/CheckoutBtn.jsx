import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const CheckoutBtn = ({ selectedItems, subtotal, userId }) => {
  const navigate = useNavigate();
  const isDisabled = selectedItems.length === 0;

  const handleLoginClick = () => {
    navigate("/checkout", { state: { selectedItems, subtotal, userId } });
  };

  return (
    <div>
      {
        /* Disable button if no items are selected */
        !isDisabled ? (
          <button
            onClick={handleLoginClick}
            className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-200"
          >
            Checkout
          </button>
        ) : (
          <button
            className="px-6 py-2 bg-gray-600 text-white font-semibold rounded-lg shadow-md cursor-not-allowed opacity-50"
          >
            Checkout
          </button>
        )
      }
    </div>
  );
};

CheckoutBtn.propTypes = {
  selectedItems: PropTypes.array.isRequired,
  subtotal: PropTypes.number.isRequired,
  userId: PropTypes.number.isRequired,
};

export default CheckoutBtn;
