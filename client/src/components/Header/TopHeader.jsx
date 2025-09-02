import { useState } from "react";
import HeaderData from "../../Data/HeaderData.jsx";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { LogoutBtn, LoginButton } from "../../utils";

const Header = () => {
  const navigate = useNavigate();
  const authStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);
  const userName = userData?.name;

  const { topHeader } = HeaderData;

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <topHeader className="sticky top-0 left-0 w-full z-50 flex flex-wrap justify-between items-center py-6 px-6 bg-gray-900 text-white shadow-lg border-b-4 border-gray-800">
      <div
        className="flex items-center justify-start cursor-pointer gap-2 hover:shadow-lg rounded-lg transition-all duration-300"
        onClick={handleLogoClick}
      >
        <div className="ml-2 text-2xl font-semibold text-white md:text-3xl hover:text-indigo-400 transition-all duration-300">
          {topHeader.appName}
        </div>
      </div>
      <div className="flex items-center justify-center gap-4">
        {topHeader.navItems.map(
          (item) =>
            item.active && (
              // <li className="py-2 lg:py-0">
              <button
                key={item.name}
                onClick={() => {
                  navigate(item.slug);
                }}
                className="px-6 py-2 rounded-lg text-lg font-medium hover:bg-blue-500 hover:text-white transition duration-300"
              >
                {item.name}
              </button>
              // </li>
            )
        )}
      </div>

      <div>
        {authStatus ? (
          <div className="flex gap-4">
            <div className="text-2xl font-semibold">Hello, {userName}</div>
            <LogoutBtn />
          </div>
        ) : (
          <div>
            <LoginButton />
          </div>
        )}
      </div>
    </topHeader>
  );
};

export default Header;
