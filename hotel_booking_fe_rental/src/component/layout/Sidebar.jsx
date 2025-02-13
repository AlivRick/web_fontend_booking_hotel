import React from "react";
import { Link } from "react-router-dom";
import { FaBed, FaClipboardList, FaHotel, FaRegBuilding } from "react-icons/fa"; // Thêm icon từ react-icons

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h5 className="sidebar-title">Admin Dashboard</h5>
      <ul className="sidebar-menu">
        <li className="sidebar-item">
          <Link to="/Checkin" className="sidebar-link">
            <FaBed className="sidebar-icon" />
            Checkin
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/existing-bookings" className="sidebar-link">
            <FaClipboardList className="sidebar-icon" />
            Manage Bookings
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/my-hotels" className="sidebar-link">
            <FaHotel className="sidebar-icon" />
            Manage Hotels
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/register-hotel" className="sidebar-link">
            <FaRegBuilding className="sidebar-icon" />
            Register New Hotel
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
