import React from "react";
import { Link } from "react-router-dom";
import { FaHotel, FaConciergeBell, FaClipboardList, FaUserShield, FaBuilding } from "react-icons/fa"; // Thêm nhiều icon khác nhau

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h5 className="sidebar-title">Admin Dashboard</h5>
      <ul className="sidebar-menu">
        <li className="sidebar-item">
          <Link to="/all-hotel" className="sidebar-link">
            <FaBuilding className="sidebar-icon" />
            Manage Hotels
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/all-booking" className="sidebar-link">
            <FaClipboardList className="sidebar-icon" />
            Manage Bookings
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/all-rental" className="sidebar-link">
            <FaUserShield className="sidebar-icon" />
            Manage Account Rental
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/hotel-facility" className="sidebar-link">
            <FaConciergeBell className="sidebar-icon" />
            Manage Hotel Facilities
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/room-facility" className="sidebar-link">
            <FaHotel className="sidebar-icon" />
            Manage Room Facilities
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
