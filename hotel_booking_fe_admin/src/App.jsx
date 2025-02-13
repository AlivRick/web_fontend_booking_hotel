import React from "react";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.min.js";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import AddRoom from "./component/room/AddRoom";
import ExistingRooms from "./component/room/ExistingRooms";
import EditRoom from "./component/room/EditRoom.jsx";
import RoomListing from "./component/room/RoomListing.jsx";
import Admin from "./component/admin/Admin.jsx";
import Checkout from "./component/bookings/Checkout.jsx";
import BookingSuccess from "./component/bookings/BookingSuccess.jsx";
import Bookings from "./component/bookings/Bookings.jsx";
import FindBooking from "./component/bookings/FindBooking.jsx";
import Registration from "./component/auth/Registration.jsx";
import Login from "./component/auth/Login.jsx";
import Profile from "./component/auth/Profile.jsx";
import Logout from "./component/auth/Logout.jsx";
import Layout from "./component/layout/Layout.jsx";
import { AuthProvider } from "./component/auth/AuthProvider.jsx";
import RequireAuth from "./component/auth/RequireAuth.jsx";
import AllHotel from "./component/admin/AllHotel.jsx";
import HotelDetails from "./component/admin/HotelDetails.jsx";
import AllHotelFacilities from "./component/admin/AllHotelFacilities.jsx";
import AllRoomFacilities from "./component/admin/AllRoomFacilities.jsx";
import UserList from "./component/admin/UserList.jsx";
import AllBooking from "./component/admin/AllBooking.jsx";
import AllUserRental from "./component/admin/AllUserRental.jsx";
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />

          {/* Protected routes using Layout */}
          <Route element={<RequireAuth><Layout /></RequireAuth>}>
            <Route path="/" element={<Admin />} />
            <Route path="/hotel-facility" element={<AllHotelFacilities />} />
            <Route path="/room-facility" element={<AllRoomFacilities />} />
            <Route path="/hoteldetails/:id" element={<HotelDetails />} />
            <Route path="/user-list" element={<UserList />} />
            <Route path="/all-hotel" element={<AllHotel />} />
            <Route path="/all-rooms" element={<RoomListing />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/booking-success" element={<BookingSuccess />} />
            <Route path="/find-booking" element={<FindBooking />} />
            <Route path="/all-booking" element={<AllBooking />} />
            <Route path="/all-rental" element={<AllUserRental />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
