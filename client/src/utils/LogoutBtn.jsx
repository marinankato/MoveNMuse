// marina
import { useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import { useNavigate } from "react-router-dom";

function LogoutBtn() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = () => {
  // Clear any stored auth data
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    localStorage.removeItem("user");

    // Update Redux state
    dispatch(logout());

    // Notify user
    alert("Successfully logged out!");

    // Redirect to home page
    navigate("/");
  };

  return (
    <button
      onClick={logoutHandler}
      className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition duration-300 shadow-md"
    >
      Logout
    </button>
  );
}

export default LogoutBtn;
