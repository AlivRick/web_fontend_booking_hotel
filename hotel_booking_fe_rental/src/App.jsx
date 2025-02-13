import React from "react";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.min.js";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";


import AddRoom from "./component/room/AddRoom";
import ExistingRooms from "./component/room/ExistingRooms";
import EditRoom from "./component/room/EditRoom.jsx";
import UpdateRoom from "./component/room/UpdateRoom.jsx";
import NavBar from "./component/layout/NavBar.jsx";
import Footer from "./component/layout/Footer.jsx";
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
import { AuthProvider } from "./component/auth/AuthProvider.jsx";
import RequireAuth from "./component/auth/RequireAuth.jsx";
import RegisterHotel from "./component/hotel/RegisterHotel.jsx";
import PendingHotels from "./component/admin/PendingHotels.jsx";
import MyHotels from "./component/hotel/MyHotels.jsx";
import Layout from "./component/layout/Layout.jsx";
import UpdateHotel from "./component/hotel/UpdateHotel.jsx";
import HotelDetails from "./component/hotel/HotelDetails.jsx";
import RoomList from "./component/room/RoomList.jsx";
import HotelOverviewWithRooms from "./component/home/HotelOverviewWithRooms.jsx";
import CheckinBooking from "./component/bookings/CheckInBooking.jsx";
import RentalRegistration from "./component/auth/RentalRegistration.jsx";
import Chart from "./component/layout/Chart.jsx";

function App() {
  return (
    <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes for login and registration */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Registration />} />
            <Route path="/register-rental" element={<RentalRegistration />} />

            {/* Protected routes for admins only */}
            <Route element={<RequireAuth><Layout /></RequireAuth>}>
              <Route path="/" element={<Admin />}/>
              <Route path="/edit-room/:roomId" element={<EditRoom />} />
              <Route path="/update-room/:roomId" element={<UpdateRoom />} />
              <Route path="/existing-rooms" element={<ExistingRooms />} />
              <Route path="/add-room" element={<AddRoom />} />
              <Route path="/book-room/:roomId" element={<Checkout />} />
              <Route path="/all-rooms" element={<RoomListing />} />
              <Route path="/existing-bookings" element={<Bookings />} />
              <Route path="/booking-success" element={<BookingSuccess />} />
              <Route path="/find-booking" element={<FindBooking />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/my-hotels" element={<MyHotels />} />
              <Route path="/hotel/:id" element={<HotelDetails />} />
              <Route path="/hotel/:id/update" element={<UpdateHotel />} />
              {/* <Switch>
                <Route path="/my-hotels" exact component={MyHotels} />
                <Route path="/hotel/:id/update" exact component={UpdateHotel} />
              </Switch> */}
              <Route path="/register-hotel" element={<RegisterHotel />} />
              <Route path="/checkin" element={<CheckinBooking />} />
              <Route path="/pending-hotels" element={<PendingHotels />} />
              <Route path="/hotel/:hotelId/rooms" element={<RoomList />} />
              <Route path="/hotel/:hotelId/add-room" element={<AddRoom />} />
              <Route path="/room" element={<HotelOverviewWithRooms />} />
              <Route path="/chart" element={<Chart />} />
            </Route>
          </Routes>
        </Router>
    </AuthProvider>
  );
}

export default App;
