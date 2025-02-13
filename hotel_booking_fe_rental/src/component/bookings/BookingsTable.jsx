import React, { useEffect, useState } from "react";
import { parseISO } from "date-fns";
import DateSlider from "../common/DateSlider";
import { confirmBooking } from "../utils/ApiFunction";  // Đảm bảo đường dẫn chính xác đến file chứa hàm API

const BookingsTable = ({ bookingInfo }) => {
  const [filteredBookings, setFilteredBookings] = useState(bookingInfo);
  const [hotelNames, setHotelNames] = useState([]);
  const [selectedHotelName, setSelectedHotelName] = useState("");
  const [guestFullName, setGuestFullName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");

  // Filter bookings based on startDate, endDate, hotelName, fullName, and email
  const filterBookings = (startDate, endDate) => {
    let filtered = bookingInfo;
    if (startDate && endDate) {
      filtered = filtered.filter((booking) => {
        const bookingStartDate = parseISO(booking.checkInDate);
        const bookingEndDate = parseISO(booking.checkOutDate);
        return (
          bookingStartDate >= startDate &&
          bookingEndDate <= endDate &&
          bookingEndDate > startDate
        );
      });
    }

    // Filter by Hotel Name
    if (selectedHotelName) {
      filtered = filtered.filter((booking) => booking.hotelName === selectedHotelName);
    }

    // Filter by Guest Full Name
    if (guestFullName) {
      filtered = filtered.filter((booking) => booking.name.toLowerCase().includes(guestFullName.toLowerCase()));
    }

    // Filter by Guest Email
    if (guestEmail) {
      filtered = filtered.filter((booking) => booking.email.toLowerCase().includes(guestEmail.toLowerCase()));
    }

    setFilteredBookings(filtered);
  };

  // Extract unique hotel names for the dropdown filter
  useEffect(() => {
    const uniqueHotelNames = [
      ...new Set(bookingInfo.map((booking) => booking.hotelName)),
    ];
    setHotelNames(uniqueHotelNames);
  }, [bookingInfo]);

  useEffect(() => {
    setFilteredBookings(bookingInfo);
  }, [bookingInfo]);

  const handleSearch = () => {
    filterBookings();
  };

  // Function to clear filters
  const clearFilters = () => {
    setSelectedHotelName("");
    setGuestFullName("");
    setGuestEmail("");
    setFilteredBookings(bookingInfo); // Show all bookings again
  };

  // Function to handle confirming booking
  const handleConfirmBooking = async (bookingId) => {
    try {
      const isConfirmed = await confirmBooking(bookingId);
      if (isConfirmed) {
        // Cập nhật trạng thái trực tiếp trong state
        const updatedBookings = filteredBookings.map((booking) =>
          booking.bookingId === bookingId
            ? { ...booking, status: 'CONFIRMED' } // Cập nhật status sau khi xác nhận
            : booking
        );
        setFilteredBookings(updatedBookings); // Cập nhật lại state filteredBookings
        alert("Booking đã được xác nhận!");
      } else {
        alert("Có lỗi khi xác nhận booking.");
      }
    } catch (error) {
      console.error("Error confirming booking:", error);
    }
  };

  return (
    <section className="p-4">
      <DateSlider
        onDateChange={filterBookings}
        onFilterChange={filterBookings}
      />

      {/* Filters Section */}
      <div className="filters">
        <select
          className="form-select"
          value={selectedHotelName}
          onChange={(e) => {
            setSelectedHotelName(e.target.value);
          }}
        >
          <option value="">All Hotels</option>
          {hotelNames.map((hotelName, index) => (
            <option key={index} value={hotelName}>
              {hotelName}
            </option>
          ))}
        </select>

        <input
          type="text"
          className="form-control"
          placeholder="Search by Full Name"
          value={guestFullName}
          onChange={(e) => setGuestFullName(e.target.value)}
        />

        <input
          type="email"
          className="form-control"
          placeholder="Search by Email"
          value={guestEmail}
          onChange={(e) => setGuestEmail(e.target.value)}
        />

        {/* Add Search Button */}
        <button
          className="btn btn-primary"
          onClick={handleSearch}
        >
          Tìm kiếm
        </button>

        {/* Add Clear Filter Button */}
        <button
          className="btn btn-secondary ms-2"
          onClick={clearFilters}
        >
          Clear Filter
        </button>
      </div>

      {/* Bookings Table */}
      <table className="table table-bordered table-hover shadow">
        <thead>
          <tr>
            <th>S/N</th>
            <th>Booking ID</th>
            <th>Hotel Name</th>
            <th>Room Names</th>
            <th>Check-In Date</th>
            <th>Check-Out Date</th>
            <th>Guest Full Name</th>
            <th>Guest Email</th>
            <th>Payment Date</th>
            <th>Payment Method</th>
            <th>Deposit Amount</th>
            <th>Status</th>
            <th colSpan={1}>Actions</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {filteredBookings.map((booking, index) => (
            <tr key={`${booking.bookingId}-${index}`}>
              <td>{index + 1}</td>
              <td>{booking.bookingId}</td>
              <td>{booking.hotelName}</td>
              <td>{booking.roomNames.join(", ")}</td>
              <td>{booking.checkInDate}</td>
              <td>{booking.checkOutDate}</td>
              <td>{booking.name}</td>
              <td>{booking.email}</td>
              <td>{booking.paymentDate || "N/A"}</td>
              <td>{booking.paymentMethod || "N/A"}</td>
              <td>{booking.depositAmount || "N/A"}</td>
              <td>{booking.status}</td>
              <td>
                <button
                  className="btn btn-success btn-sm"
                  onClick={() => handleConfirmBooking(booking.bookingId)}
                >
                  Xác Nhận
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {filteredBookings.length === 0 && <p>No booking found for the selected filters</p>}
    </section>
  );
};

export default BookingsTable;
