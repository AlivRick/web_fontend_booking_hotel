import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getHotelById, approveHotel, rejectHotel } from "../utils/ApiFunction";
import { FaCheckCircle, FaTimesCircle, FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";

const HotelDetails = () => {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const data = await getHotelById(id);
        setHotel(data);
        setLoading(false);
      } catch (err) {
        setError("Error fetching hotel details.");
        setLoading(false);
      }
    };
    fetchHotel();
  }, [id]);

  const handleApprove = async () => {
    try {
      await approveHotel(id);
      setStatusMessage("Hotel approved successfully.");
      navigate("/all-hotel");
    } catch (err) {
      setStatusMessage("Failed to approve the hotel.");
    }
  };

  const handleReject = async () => {
    try {
      await rejectHotel(id);
      setStatusMessage("Hotel rejected successfully.");
      navigate("/all-hotel");
    } catch (err) {
      setStatusMessage("Failed to reject the hotel.");
    }
  };

  const getImageSrc = (photo) => {
    return photo ? `data:image/png;base64,${photo}` : "https://via.placeholder.com/150";
  };

  if (loading) return <p>Loading hotel details...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container my-5">
      {hotel && (
        <div>
          {/* Hotel Header */}
          <div className="row mb-5 align-items-center">
            <div className="col-md-6">
              <h1 className="display-5 text-primary">{hotel.name}</h1>
              <p className="text-muted">{hotel.description}</p>
            </div>
            <div className="col-md-6 text-center">
              <img
                src={getImageSrc(hotel.photo)}
                alt={hotel.name}
                className="img-fluid rounded shadow-lg"
                style={{ maxHeight: "400px", objectFit: "cover" }}
              />
            </div>
          </div>

          {/* Facilities */}
          {hotel.facilityNames?.length > 0 && (
            <div className="mb-5">
              <h4 className="text-secondary">Facilities</h4>
              <ul className="list-group">
                {hotel.facilityNames.map((facility, index) => (
                  <li key={index} className="list-group-item border-0 shadow-sm rounded my-2">
                    {facility}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Address & Contact */}
          <div className="row mb-5">
            <div className="col-md-6 mb-4">
              <div className="card shadow-sm border-0">
                <div className="card-body">
                  <h5 className="card-title text-secondary">
                    <FaMapMarkerAlt className="me-2 text-primary" />
                    Address
                  </h5>
                  <p className="card-text">
                    {hotel.street}, {hotel.wardName}, {hotel.districtName}, {hotel.provinceName}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-4">
              <div className="card shadow-sm border-0">
                <div className="card-body">
                  <h5 className="card-title text-secondary">
                    <FaPhone className="me-2 text-primary" />
                    Contact
                  </h5>
                  <p className="card-text">
                    <strong>Phone:</strong> {hotel.phoneNumber}
                  </p>
                  <p className="card-text">
                    <strong>Email:</strong> {hotel.email}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="mb-5">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <h5 className="card-title text-secondary">
                  Status
                </h5>
                <p className={`badge ${hotel.status === "PENDING" ? "bg-warning" : hotel.status === "APPROVED" ? "bg-success" : "bg-danger"}`}>
                  {hotel.status}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="text-center mb-5">
            {hotel.status === "PENDING" ? (
              <>
                <button className="btn btn-success me-3" onClick={handleApprove}>
                  <FaCheckCircle className="me-2" />
                  Approve Hotel
                </button>
                <button className="btn btn-danger" onClick={handleReject}>
                  <FaTimesCircle className="me-2" />
                  Reject Hotel
                </button>
              </>
            ) : (
              <p className="text-muted">This hotel has already been reviewed.</p>
            )}
          </div>

          {/* Photos */}
          {hotel.photos?.length > 0 && (
            <div className="mb-5">
              <h4 className="text-secondary">Photos</h4>
              <div className="row">
                {hotel.photos.map((photo, index) => (
                  <div className="col-md-4 mb-4" key={index}>
                    <div className="card shadow-sm">
                      <img
                        src={getImageSrc(photo)}
                        alt={`Hotel Photo ${index + 1}`}
                        className="card-img-top rounded"
                        style={{ maxHeight: "200px", objectFit: "cover" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Status Message */}
          {statusMessage && (
            <div className="alert alert-info text-center mt-4">{statusMessage}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default HotelDetails;
