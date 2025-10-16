import { Outlet, useLocation } from "react-router-dom";
import { Header } from "../components";
import ScrollToTop from "../components/ScrollToTop";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { login } from "../store/authSlice";
import { jwtDecode } from "jwt-decode";

const Layout = () => {
  const dispatch = useDispatch();

  const showHeader = true;

  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    console.log("TOKEN FOUND:", token);

    if (token && token.split(".").length === 3) {
      try {
        const decoded = jwtDecode(token);
        console.log("DECODED TOKEN:", decoded);

        dispatch(
          login({
            id: decoded.id, 
            email: decoded.email,
            firstName: decoded.firstName || decoded.name,
            lastName: decoded.lastName || "",
            role: decoded.role || "customer",
          })
        );
      } catch (err) {
        console.error("Token decoding failed:", err);
      }
    } else {
      console.warn("Invalid token format or user logged out.");
    }
  }, [dispatch]);

  return (
    <>
      <ScrollToTop />
      {showHeader && <Header />}

      <div className="flex flex-col lg:flex-row min-h-screen">
        <div className="flex-1 bg-gray-100 overflow-auto">
          <Outlet />
        </div>
      </div>

    </>
  );
};

export default Layout;
