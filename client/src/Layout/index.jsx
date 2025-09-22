import { Outlet, useLocation } from "react-router-dom";
import { Header, Footer } from "../components";
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
    if (token) {
      try {
        const decoded = jwtDecode(token);
        dispatch(
          login({
            email: decoded.email,
            firstName: decoded.firstName || decoded.name,
          })
        );
      } catch (err) {
        console.error("Token decoding failed:", err);
      }
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

      <Footer />
    </>
  );
};

export default Layout;
