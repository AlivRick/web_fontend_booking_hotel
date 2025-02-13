import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import NavBar from "./NavBar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

const Layout = () => {
  const location = useLocation();

  // Ẩn Sidebar cho trang login hoặc register
  const hideSidebar = ["/login", "/register"].includes(location.pathname);

  return (
    <div className="d-flex flex-column vh-100">
      {/* Thanh NavBar */}
      <NavBar />

      <div className="flex-grow-1 d-flex">
        {/* Sidebar: Chỉ hiện nếu không phải login/register */}
        {!hideSidebar && <Sidebar />}

        {/* Vùng nội dung chính */}
        <div className="flex-grow-1 p-3">
          <Outlet />
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
    
  );
};

export default Layout;
