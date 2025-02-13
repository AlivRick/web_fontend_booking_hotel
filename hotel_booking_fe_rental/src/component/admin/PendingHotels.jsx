import React, { useEffect, useState } from "react";
import { approveHotel, getPendingHotels } from "../utils/ApiFunction";

const PendingHotels = () => {
  const [hotels, setHotels] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchPendingHotels = async () => {
      try {
        const response = await getPendingHotels();
        setHotels(response);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchPendingHotels();
  }, []);

  const handleApprove = async (hotelId) => {
    try {
      await approveHotel(hotelId);
      setMessage("Hotel approved successfully!");
      setHotels(hotels.filter((hotel) => hotel.id !== hotelId));
    } catch (error) {
      setMessage("Error approving hotel");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Pending Hotels for Approval</h2>
      {message && <div className="alert alert-success">{message}</div>}
      <table className="table mt-3">
        <thead>
          <tr>
            <th>Name</th>
            <th>Location</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {hotels.map((hotel) => (
            <tr key={hotel.id}>
              <td>{hotel.name}</td>
              <td>{hotel.address}</td>
              <td>{hotel.description}</td>
              <td>
                <button
                  className="btn btn-success"
                  onClick={() => handleApprove(hotel.id)}
                >
                  Approve
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PendingHotels;
