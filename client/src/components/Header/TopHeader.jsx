import { useState } from "react";
import HeaderData from "../../Data/HeaderData.jsx";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { LogoutBtn, LoginButton } from "../../utils";
import { useAuth } from "../../components/auth/AuthContext.jsx";

const Header = () => {
  const navigate = useNavigate();
  const authStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);
  const userName = userData?.firstName;

  const { topHeader, userHeader } = HeaderData;
  const { user } = useAuth();


  const normalize = (slug) => (slug?.startsWith("/") ? slug : `/${slug || ""}`);

  const isStaff = user?.role === "staff" || user?.role === "admin";

  return (
    <div className="sticky top-0 left-0 w-full z-50 flex flex-wrap justify-between items-center py-6 px-6 bg-gray-900 text-white shadow-lg border-b-4 border-gray-800">
      <div
        className="flex items-center justify-start cursor-pointer gap-2 hover:shadow-lg rounded-lg transition-all duration-300"
        onClick={() => navigate("/")}
      >
        <div className="ml-2 text-2xl font-semibold text-white md:text-3xl hover:text-indigo-400 transition-all duration-300">
          {topHeader.appName}
        </div>
      </div>
      <div className="flex items-center justify-center gap-4">
        {topHeader.navItems
          .map(
            (item) =>
              item.active && (
                <button
                  key={item.name}
                  onClick={() => {
                    navigate(item.slug);
                  }}
                  className="px-6 py-2 rounded-lg text-lg font-medium hover:bg-blue-500 hover:text-white transition duration-300"
                >
                  {item.name}
                </button>
              )
          )}

      </div>
      <div>
          {authStatus && userHeader.navItems.map(
            (item) =>
              item.active && (
                <button
                  key={item.name}
                  onClick={() => {
                    navigate(item.slug);
                  }}
                  className="px-6 py-2 rounded-lg text-lg font-medium hover:bg-blue-500 hover:text-white transition duration-300"
                >
                  {item.name}
                </button>
              )
          )}
      </div>

      <div>
        {authStatus ? (
          <div className="flex items-center gap-4">
            <div className="text-lg font-medium">Hello, {userName}</div>
            <LogoutBtn />
          </div>
        ) : (
          <div>
            <LoginButton />
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
