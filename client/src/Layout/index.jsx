import { Outlet, useLocation } from "react-router-dom";
import { Header, Footer } from "../components";
import { useState } from "react";

const Layout = () => {
  const location = useLocation(); // Get the current location (path)

  // Conditionally render the Header based on the current route
  const showHeader = location.pathname !== "/login";

  return (
    <>
      {/* Top Header */}
      <Header />

      <div className="flex flex-col lg:flex-row h-screen">
        {/* Main Content */}
        <div className={`flex-1 bg-gray-100 overflow-auto`}>
          <Outlet />
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </>
  );
};

export default Layout;
