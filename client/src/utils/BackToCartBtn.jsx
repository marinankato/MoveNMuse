import { useNavigate } from "react-router-dom";

const BackToCartBtn = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/cart");
  };

  return (
          <button
            onClick={handleLoginClick}
            className="px-6 py-2 bg-gray-100 text-gray-900 font-semibold rounded-lg shadow-md hover:bg-white transition duration-200 mr-3"
          >
            Back to Cart
          </button>
  );
};

export default BackToCartBtn;
