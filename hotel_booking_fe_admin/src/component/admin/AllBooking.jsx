import React, { useEffect, useState } from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, CircularProgress, Paper, Select, MenuItem } from '@mui/material';
import { getAllBooking, updateBookingStatus } from '../utils/ApiFunction';

const BookingAdmin = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [filters, setFilters] = useState({ email: '', hotelName: '', status: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAllBooking();
        setBookings(data);
        setFilteredBookings(data); // Hiển thị tất cả khi chưa có bộ lọc
      } catch (err) {
        setError('Error fetching bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));

    // Lọc dữ liệu theo bộ lọc mới
    setFilteredBookings(
      bookings.filter((booking) =>
        (name === 'email' && booking.email?.toLowerCase().includes(value.toLowerCase())) ||
        (name === 'hotelName' && booking.hotelName?.toLowerCase().includes(value.toLowerCase())) ||
        (name === 'status' && booking.status?.toLowerCase().includes(value.toLowerCase()))
      )
    );
  };

  const resetFilters = () => {
    setFilters({ email: '', hotelName: '', status: '' });
    setFilteredBookings(bookings); // Reset danh sách
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      setLoading(true);
      await updateBookingStatus(bookingId, newStatus);
      setBookings((prev) => 
        prev.map((booking) => 
          booking.bookingId === bookingId ? { ...booking, status: newStatus } : booking
        )
      );
      setFilteredBookings((prev) => 
        prev.map((booking) => 
          booking.bookingId === bookingId ? { ...booking, status: newStatus } : booking
        )
      );
      alert('Status updated successfully!');
    } catch (err) {
      alert('Error updating status.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading"><CircularProgress /> Loading bookings...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="booking-admin">
      <h1>Booking Management</h1>
      
      {/* Filter Section */}
      <div className="filters">
        <TextField
          label="Filter by Email"
          name="email"
          variant="outlined"
          value={filters.email}
          onChange={handleFilterChange}
          className="filter-input"
          size="small"
        />
        <TextField
          label="Filter by Hotel Name"
          name="hotelName"
          variant="outlined"
          value={filters.hotelName}
          onChange={handleFilterChange}
          className="filter-input"
          size="small"
        />
        <Select
          label="Filter by Status"
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          className="filter-input"
          size="small"
          displayEmpty
        >
          <MenuItem value="">All Status</MenuItem>
          <MenuItem value="PENDING">PENDING</MenuItem>
          <MenuItem value="CONFIRMED">CONFIRMED</MenuItem>
          <MenuItem value="CANCELLED">CANCELLED</MenuItem>
          <MenuItem value="COMPLETED">COMPLETED</MenuItem>
          <MenuItem value="DEPOSITED">DEPOSITED</MenuItem>
        </Select>
        <Button variant="outlined" onClick={resetFilters} className="reset-filter-btn">
          Reset Filters
        </Button>
      </div>

      {/* Booking Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Booking ID</TableCell>
              <TableCell>Customer Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Hotel Name</TableCell>
              <TableCell>Room Names</TableCell>
              <TableCell>Check-in Date</TableCell>
              <TableCell>Check-out Date</TableCell>
              <TableCell>Total Price</TableCell>
              <TableCell>Deposit Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBookings.map((booking) => (
              <TableRow key={booking.bookingId}>
                <TableCell>{booking.bookingId || 'N/A'}</TableCell>
                <TableCell>{booking.name || 'N/A'}</TableCell>
                <TableCell>{booking.email || 'N/A'}</TableCell>
                <TableCell>{booking.hotelName || 'N/A'}</TableCell>
                <TableCell>{booking.roomNames?.join(', ') || 'N/A'}</TableCell>
                <TableCell>{booking.checkInDate || 'N/A'}</TableCell>
                <TableCell>{booking.checkOutDate || 'N/A'}</TableCell>
                <TableCell>{booking.totalPrice?.toLocaleString() || 'N/A'} VND</TableCell>
                <TableCell>{booking.depositAmount?.toLocaleString() || 'N/A'} VND</TableCell>
                <TableCell>{booking.status || 'N/A'}</TableCell>
                <TableCell>
                  <Select
                    value={booking.status}
                    onChange={(e) => handleStatusChange(booking.bookingId, e.target.value)}
                    size="small"
                  >
                    <MenuItem value="PENDING">PENDING</MenuItem>
                    <MenuItem value="CONFIRMED">CONFIRMED</MenuItem>
                    <MenuItem value="CANCELLED">CANCELLED</MenuItem>
                    <MenuItem value="COMPLETED">COMPLETED</MenuItem>
                    <MenuItem value="DEPOSITED">DEPOSITED</MenuItem>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default BookingAdmin;
