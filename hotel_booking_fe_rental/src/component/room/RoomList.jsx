import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom"; // Sử dụng useParams để lấy hotelId
import { getRoomsByHotelId } from "../utils/ApiFunction"; // Hàm API lấy phòng theo hotelId
import { Carousel } from "react-bootstrap"; // Thư viện Carousel
import { useNavigate } from "react-router-dom";

const HotelRooms = () => {
    const { hotelId } = useParams(); // Lấy hotelId từ URL
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Hook điều hướng

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const data = await getRoomsByHotelId(hotelId); // Gọi API lấy danh sách phòng của khách sạn
                setRooms(data);
                setLoading(false);
            } catch (err) {
                setError("An error occurred while fetching rooms.");
                setLoading(false);
            }
        };

        fetchRooms();
    }, [hotelId]);

    if (loading) return <p>Loading rooms...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center">
                <h2>Rooms in Your Hotel</h2>
                <Link to={`/hotel/${hotelId}/add-room`} className="btn btn-primary">
                    Add Room
                </Link>
            </div>
            {rooms.length === 0 ? (
                <p>No rooms available in this hotel.</p>
            ) : (
                <div className="row">
                    {rooms.map((room) => (
                        <div className="col-md-4 mb-4" key={room.id}>
                            <div className="card h-100">
                                {/* Carousel for room photos */}
                                {room.photos.length > 0 && (
                                    <Carousel>
                                        {room.photos.map((photo, index) => (
                                            <Carousel.Item key={index}>
                                                <img
                                                    src={`data:image/jpeg;base64,${photo}`}
                                                    className="d-block w-100 room-image" // Thêm class 'room-image'
                                                    alt={`Room photo ${index + 1}`}
                                                />
                                            </Carousel.Item>
                                        ))}
                                    </Carousel>
                                )}
                                <div className="card-body">
                                    <h5 className="card-title">{room.name}</h5>
                                    <p className="card-text">Price: {room.roomPrice}</p>
                                    <p className="card-text">Quantity: {room.quantity}</p>
                                    <p className="card-text">
                                        <strong>Room Type:</strong> {room.roomType}
                                    </p>
                                    <p className="card-text">
                                        <strong>Facilities:</strong> {room.facilities.join(", ")}
                                    </p>
                                    <p className="card-text">
                                        <strong>Deposit Percentage:</strong> {room.depositPercentage * 100}%
                                    </p>
                                    <div className="d-flex justify-content-between">
                                        <Link to={`/update-room/${room.id}`} className="btn btn-primary">
                                            Update Room
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HotelRooms;