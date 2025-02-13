import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyHotels } from "../utils/ApiFunction";

const MyHotels = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const data = await getMyHotels();
        setHotels(data);
        setLoading(false);
      } catch (err) {
        if (err.response && err.response.status === 403) {
          setError("You do not have permission to view this page. Please check your role.");
        } else {
          setError("An error occurred while fetching your hotels.");
        }
        setLoading(false);
      }
    };
    fetchHotels();
  }, []);

  const getImageSrc = (photo) => {
    return photo ? `data:image/png;base64,${photo}` : "https://via.placeholder.com/150";
  };

  if (loading) return <p>Loading your hotels...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mt-4">
      <h2 className="text-primary mb-4">Your Registered Hotels</h2>
      {hotels.length === 0 ? (
        <p className="text-muted">You have not registered any hotels yet.</p>
      ) : (
        <div className="row">
          {hotels.map((hotel) => (
            <div className="col-md-4 mb-4" key={hotel.id}>
              <div className="card h-100 shadow-sm border-light">
                <img
                  src={getImageSrc(hotel.photo)}
                  className="card-img-top rounded-top"
                  alt={hotel.name}
                  style={{ objectFit: "cover", maxHeight: "200px" }}
                />
                <div className="card-body">
                  <h5 className="card-title text-truncate">{hotel.name}</h5>
                  <p className="card-text text-muted">
                    {hotel.description || "No description available."}
                  </p>
                  <p className="mb-2">
                    <strong>Address:</strong> {hotel.street}, {hotel.wardName || "N/A"} - {hotel.districtName || "N/A"} - {hotel.provinceName || "N/A"}
                  </p>
                  <p className="mb-2">
                    <strong>Contact:</strong> {hotel.phoneNumber || "N/A"}
                  </p>
                  <p className="mb-2">
                    <strong>Email:</strong> {hotel.email || "N/A"}
                  </p>
                  <p>
                    <strong>Status:</strong> <span className="badge bg-primary text-white">{hotel.status || "N/A"}</span>
                  </p>
                  <div className="d-flex justify-content-between mt-3">
                    <Link to={`/hotel/${hotel.id}`} className="btn btn-primary btn-sm">
                      View Details
                    </Link>
                    <Link to={`/hotel/${hotel.id}/update`} className="btn btn-warning btn-sm">
                      Update
                    </Link>
                    <Link to={`/hotel/${hotel.id}/rooms`} className="btn btn-secondary btn-sm">
                      Rooms
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

export default MyHotels;
