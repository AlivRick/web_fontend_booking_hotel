import React, { useState, useEffect } from "react";
import { addRoom, getRoomFacilities, getRoomTypes } from "../utils/ApiFunction";
import { useParams } from 'react-router-dom';
import Select from "react-select";
const AddRoom = () => {
  const { hotelId } = useParams(); // Lấy hotelId từ URL
  const [roomTypes, setRoomTypes] = useState([]);
  const [selectedRoomType, setSelectedRoomType] = useState(null);
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    roomPrice: "",
    quantity: 1,
    hotelId: hotelId,
    photos: [], // File ảnh từ input
    depositPercentage: 0, // Thêm trường depositPercentage
  });

  const [facilities, setFacilities] = useState([]); // Lưu danh sách tiện ích từ server
  const [preview, setPreview] = useState([]); // Lưu URL preview của hình ảnh
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, photos: files });
    const previewFiles = files.map((file) => URL.createObjectURL(file));
    setPreview(previewFiles);
  };

  const handleDepositPercentageChange = (selectedOption) => {
    setFormData({ ...formData, depositPercentage: selectedOption.value / 100});
  };

  useEffect(() => {
    return () => {
      preview.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [preview]);

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const data = await getRoomFacilities(); // Gọi API lấy danh sách tiện ích
        setFacilities(data); // Lưu vào state
        
      } catch (error) {
        console.error("Error fetching facilities:", error.message);
      }
      
    };

    const fetchRoomTypes = async () => {
      const roomTypesData = await getRoomTypes();
      setRoomTypes(roomTypesData);
    };
    fetchRoomTypes();

    fetchFacilities();
  }, []);

  const handleSelectRoomType = (event) => {
    setSelectedRoomType(event.target.value);
    setFormData({ ...formData, roomTypeId: event.target.value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    // Xử lý FormData

    const roomData = new FormData();
    roomData.append("name", formData.name);
    roomData.append("roomPrice", formData.roomPrice);
    roomData.append("quantity", formData.quantity);
    roomData.append("hotelId", formData.hotelId);
    roomData.append("roomTypeId", selectedRoomType);
    roomData.append("depositPercentage", formData.depositPercentage); // Gửi depositPercentage
    selectedFacilities.forEach((facilityId) => {
      roomData.append("facilityIds", facilityId);
    });

    formData.photos.forEach((photo) => {
      roomData.append("photos", photo);
    });

    try {
      const result = await addRoom(roomData); // Gọi API Function
      alert("Room added successfully!");
      console.log(result);
    } catch (error) {
      alert("Failed to add room. Please try again.");
    }
  };
  // Tạo danh sách tỷ lệ phần trăm
  const depositOptions = Array.from({ length: 21 }, (_, i) => ({
    value: i * 5,
    label: `${i * 5}%`,
  }));

  return (
    <div className="container mt-4">
      <h2>Add a New Room</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Room Name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="roomPrice" className="form-label">
            Room Price
          </label>
          <input
            type="number"
            className="form-control"
            id="roomPrice"
            name="roomPrice"
            value={formData.roomPrice}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="quantity" className="form-label">
            Quantity
          </label>
          <input
            type="number"
            className="form-control"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
          />
        </div>



        <div className="mb-3">
          <label htmlFor="roomTypeId" className="form-label">
            Room Type ID
          </label>
          <select
            id="roomTypeId"
            name="roomTypeId"
            className="form-select"
            value={formData.roomTypeId}
            onChange={handleSelectRoomType}
          >
            <option value="">Select Room Type</option>
            {roomTypes.map((roomType) => (
              <option key={roomType.id} value={roomType.id}>
                {roomType.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Facilities</label>
          <Select
            options={facilities.map((facility) => ({
              value: facility.id,
              label: facility.name,
            }))}
            isMulti
            onChange={(selectedOptions) =>
              setSelectedFacilities(selectedOptions.map((option) => option.value))
            }
            placeholder="Select facilities..."
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Deposit Percentage</label>
          <Select
            options={depositOptions}
            onChange={handleDepositPercentageChange}
            placeholder="Select deposit percentage..."
          />
        </div>

        {preview.length > 0 && (
          <div className="mb-3">
            <h5>Image Preview:</h5>
            <div className="d-flex flex-wrap">
              {preview.map((url, index) => (
                <img key={index} src={url} alt={`Preview ${index}`} style={{ width: '100px', height: '100px', marginRight: '10px' }} />
              ))}
            </div>
          </div>
        )}
        
        <div className="mb-3">
          <label htmlFor="photos" className="form-label">
            Photos
          </label>
          <input
            type="file"
            className="form-control"
            id="photos"
            name="photos"
            multiple
            onChange={handleFileChange}
          />
        </div>
        
        
        <button type="submit" className="btn btn-primary">
          Add Room
        </button>
      </form>
    </div>
  );
};

export default AddRoom;
