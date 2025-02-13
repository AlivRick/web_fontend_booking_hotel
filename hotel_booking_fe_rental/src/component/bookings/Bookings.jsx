import React, { useEffect, useState } from "react";
import { cancelBooking, getBookingsByOwner } from "../utils/ApiFunction"; // Đảm bảo tên hàm chính xác
import Header from "./../common/Header";
import BookingsTable from "./BookingsTable";

const Bookings = () => {
  const [bookingInfo, setBookingInfo] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getBookingsByOwner(); // Gọi API chính xác
        // Cập nhật dữ liệu trước khi lưu vào state để thay thế các giá trị không có với "N/A"
        const updatedData = data.map((booking) => ({
          ...booking,
          paymentDate: booking.paymentDate ? booking.paymentDate : "N/A",
          paymentMethod: booking.paymentMethod ? booking.paymentMethod : "N/A",
          depositAmount: booking.depositAmount ? booking.depositAmount : "N/A",
        }));
        setBookingInfo(updatedData);
        console.log(updatedData);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleBookingCancellation = async (bookingId) => {
    try {
      await cancelBooking(bookingId); // Gọi API hủy booking
      const updatedBookings = await getBookingsByOwner(); // Lấy danh sách bookings mới

      setBookingInfo(updatedBookings);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <section style={{ backgroundColor: "whitesmoke" }}>
      <Header title={"Existing Bookings"} />
      {error && <div className="text-danger">{error}</div>}
      {isLoading ? (
        <div>Loading existing bookings...</div>
      ) : (
        <BookingsTable
          bookingInfo={bookingInfo}
          handleBookingCancellation={handleBookingCancellation}
        />
      )}
    </section>
  );
};

export default Bookings;
