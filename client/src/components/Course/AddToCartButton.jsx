// Jiayu
import PropTypes from "prop-types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "../../utils/auth";
import {
  addCartItemByToken,
  addCartItemByUserId,
} from "../../services/cartService";

export default function AddToCartButton({
  productId,
  occurrenceId = null,
  title,
  price,
  onSuccess,
}) {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [hint, setHint] = useState("");

  const handleClick = async () => {
    setHint("");
    const token = getToken();
    if (!token) {
      nav("/login", {
        replace: false,
        state: { redirectTo: location.pathname },
      });
      return;
    }

    setLoading(true);
    try {
      // backend uses token to identify user
      await addCartItemByToken({ productId, occurrenceId, title, price });
      setHint("has been added to cart");
      onSuccess?.();
    } catch (errFirst) {
      // fallback to userId
      try {
        await addCartItemByUserId({ productId, occurrenceId, title, price });
        setHint("has been added to cart");
        onSuccess?.();
      } catch (errSecond) {
        console.error("Add to cart failed:", errFirst, errSecond);
        setHint(
          errSecond?.message ||
            errFirst?.message ||
            "Failed to add to cart, please try again later"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleClick} disabled={loading} aria-busy={loading}>
        {loading ? "Adding…" : "Add to Cart"}
      </button>
      {hint && (
        <div role="status" style={{ marginTop: 8 }}>
          {hint}
        </div>
      )}
    </div>
  );
}

// PropTypes validation
AddToCartButton.propTypes = {
  productId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
  occurrenceId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  title: PropTypes.string,
  price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onSuccess: PropTypes.func,
};
