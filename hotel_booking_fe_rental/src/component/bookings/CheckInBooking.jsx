import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { checkInBooking } from "../utils/ApiFunction"; // Đảm bảo đã tạo hàm checkIn

const Bookings = () => {
  const [showModal, setShowModal] = useState(false); // Điều khiển Modal
  const [bookingResponse, setBookingResponse] = useState(null);
  const [error, setError] = useState("");
  const [bookingCode, setBookingCode] = useState(""); // Trạng thái để lưu bookingCode nhập vào

  // Handle check-in
  const handleCheckIn = async () => {
    try {
      const response = await checkInBooking(bookingCode); // Truyền bookingCode vào API
      setBookingResponse(response); // Lưu dữ liệu trả về từ API
      setShowModal(true); // Hiển thị modal sau khi check-in thành công
    } catch (error) {
      setError("Failed to check-in: " + error.message);
    }
  };

  return (
    
    <section className="checkin-container">
      <div className="checkin-box">
        <h2>Check-in</h2>

        {/* Ô nhập liệu mã đặt phòng */}
        <Form.Group controlId="formBookingCode" className="mb-3">
          <Form.Label>Enter Booking Code</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter booking code"
            value={bookingCode}
            onChange={(e) => setBookingCode(e.target.value)}
            className="form-control"
          />
        </Form.Group>

        {/* Nút Check-in */}
        <Button onClick={handleCheckIn} className="btn btn-primary btn-block">
          Check-in
        </Button>

        {/* Hiển thị lỗi nếu có */}
        {error && <div className="alert alert-danger mt-3">{error}</div>}

        {/* Modal Popup */}
        {bookingResponse && (
          <Modal show={showModal} onHide={() => setShowModal(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>Check-in Success!</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>Booking ID: {bookingResponse.bookingId}</p>
              <p>Hotel Name: {bookingResponse.hotelName}</p>
              <p>Guest Name: {bookingResponse.name}</p>
              <p>Check-in Date: {bookingResponse.checkInDate}</p>
              <p>Check-out Date: {bookingResponse.checkOutDate}</p>
              <p>Total Price: ${bookingResponse.totalPrice}</p>
              <p>Deposit Amount: ${bookingResponse.depositAmount}</p>
              <p>Payment Method: {bookingResponse.paymentMethod}</p>
              <p>Payment Date: {bookingResponse.paymentDate}</p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </div>
    </section>
  );
};

export default Bookings;
