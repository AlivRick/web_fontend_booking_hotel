import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Select from 'react-select'; // Đừng quên import Select
import {
  getHotelById,
  updateHotel,
  getProvinces,
  getDistrictsByProvince,
  getWardsByDistrict,
  getFacilities
} from "../utils/ApiFunction";

const UpdateHotel = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [hotel, setHotel] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    description: "",
    street: "",
    provinceId: "",
    districtId: "",
    wardId: "",
    coverPhoto: null,
    newPhotos: [],
    facilityNames: []
  });

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [facilities, setFacilities] = useState([]);
  const [currentPhotos, setCurrentPhotos] = useState([]);
  const [newPhotos, setNewPhotos] = useState([]); // Danh sách ảnh mới thêm vào
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  useEffect(() => {
    // Chuyển đổi facilities thành định dạng mà Select cần
    const formattedFacilities = facilities.map((facility) => ({
      value: facility.name, // Sử dụng name làm value
      label: facility.name,
    }));
    setSelectedFacilities(formattedFacilities.filter(facility => hotel.facilityNames.includes(facility.label)));
  }, [facilities, hotel.facilityNames]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getHotelById(id);
        console.log(data);
        setCurrentPhotos(data.photos || []);
        setHotel((prev) => ({
          ...prev,
          name: data.name,
          phoneNumber: data.phoneNumber,
          email: data.email,
          description: data.description,
          street: data.street,
          provinceId: data.provinceId || "",
          districtId: data.districtId || "",
          wardId: data.wardId || "",
          facilityNames: data.facilityNames || [],
          coverPhoto: data.photo || null // Lưu coverPhoto vào state
        }));

        const provincesData = await getProvinces();
        setProvinces(provincesData);

        if (data.provinceId) {
          const districtsData = await getDistrictsByProvince(data.provinceId);
          setDistricts(districtsData);
        }

        if (data.districtId) {
          const wardsData = await getWardsByDistrict(data.districtId);
          setWards(wardsData);
        }

        const facilitiesData = await getFacilities();
        setFacilities(facilitiesData);

        setLoading(false);
      } catch (err) {
        setError("Failed to fetch data.");
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleFacilityChange = (selectedOptions) => {
    const selectedValues = selectedOptions ? selectedOptions.map(option => option.label) : [];
    setHotel((prevHotel) => ({
      ...prevHotel,
      facilityNames: selectedValues,
    }));
    setSelectedFacilities(selectedOptions);
  };

  const handleAddPhoto = (e) => {
    const files = Array.from(e.target.files);
    setNewPhotos((prev) => [...prev, ...files]); // Thêm ảnh mới vào danh sách newPhotos
  };

  const handleDeletePhoto = (index) => {
    // Xóa ảnh khỏi currentPhotos
    setCurrentPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleProvinceChange = async (e) => {
    const provinceId = e.target.value;
    setHotel((prev) => ({ ...prev, provinceId, districtId: "", wardId: "" }));
    setDistricts([]);
    setWards([]);

    if (provinceId) {
      try {
        const districtsData = await getDistrictsByProvince(provinceId);
        setDistricts(districtsData);
      } catch (err) {
        console.error("Error fetching districts:", err);
      }
    }
  };

  const handleDistrictChange = async (e) => {
    const districtId = e.target.value;
    setHotel((prev) => ({ ...prev, districtId, wardId: "" }));
    setWards([]);

    if (districtId) {
      try {
        const wardsData = await getWardsByDistrict(districtId);
        setWards(wardsData);
      } catch (err) {
        console.error("Error fetching wards:", err);
      }
    }
  };

  const handleWardChange = (e) => {
    const wardId = e.target.value;
    setHotel((prev) => ({ ...prev, wardId }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHotel((prev) => ({ ...prev, [name]: value }));
  };

  const handleCoverPhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setHotel((prev) => ({
        ...prev,
        coverPhoto: file,
      }));
    }
  };

  const handleDeleteCoverPhoto = () => {
    setHotel((prev) => ({
      ...prev,
      coverPhoto: null,
    }));
  };

  const base64ToFile = (base64String, filename) => {
    const bstr = atob(base64String); // Giải mã base64
    const n = bstr.length;
    const u8arr = new Uint8Array(n);
  
    for (let i = 0; i < n; i++) {
      u8arr[i] = bstr.charCodeAt(i);
    }
  
    return new File([u8arr], filename, { type: 'image/jpeg' }); // Giả sử ảnh là JPEG
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", hotel.name);
    formData.append("phoneNumber", hotel.phoneNumber);
    formData.append("email", hotel.email);
    formData.append("description", hotel.description);
    formData.append("street", hotel.street);
    formData.append("wardId", hotel.wardId);
    formData.append("facilityNames", hotel.facilityNames);
    // Chỉ gửi coverPhoto nếu có thay đổi
    if (hotel.coverPhoto instanceof File) {
      formData.append('coverPhoto', hotel.coverPhoto); // Gửi cover photo mới
    }

   // Chuyển đổi ảnh hiện có từ base64 thành File
  const allPhotos = [
    ...currentPhotos.map((photo, index) => base64ToFile(photo, `photo_${index}.jpg`)), // Chuyển đổi base64 thành File
    ...newPhotos // Giữ nguyên ảnh mới
  ];

  allPhotos.forEach((photo) => {
    formData.append('photos', photo); // Gửi từng ảnh
  });

    try {
      await updateHotel(id, formData);
      navigate(`/hotel/${id}`);
    } catch (err) {
      setError("Failed to update hotel.");
      console.error(err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mt-4">
      <h2>Update Hotel</h2>
      <form onSubmit={handleSubmit}>
        {/* Hotel Name */}
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Hotel Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={hotel.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Phone Number */}
        <div className="mb-3">
          <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
          <input
            type="text"
            className="form-control"
            id="phoneNumber"
            name="phoneNumber"
            value={hotel.phoneNumber}
            onChange={handleChange}
            required
          />
        </div>

        {/* Email */}
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={hotel.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Description */}
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            rows="4"
            value={hotel.description}
            onChange={handleChange}
            required
          />
        </div>

       {/* Facilities */}
       <div className="mb-4">
          <label className="form-label">Facilities</label>
          <Select
            options={facilities.map((facility) => ({
              value: facility.name, // Sử dụng name làm value
              label: facility.name,
            }))}
            isMulti
            value={selectedFacilities}
            onChange={handleFacilityChange}
            placeholder="Select facilities..."
          />
        </div>

        {/* Street */}
        <div className="mb-3">
          <label htmlFor="street" className="form-label">Street</label>
          <input
            type="text"
            className="form-control"
            id="street"
            name="street"
            value={hotel.street}
            onChange={handleChange}
            required
          />
        </div>

        {/* Province */}
        <div className="mb-3">
          <label htmlFor="province" className="form-label">Province</label>
          <select
            className="form-select"
            id="province"
            value={hotel.provinceId}
            onChange={handleProvinceChange}
          >
            <option value="">Select Province</option>
            {provinces.map((province) => (
              <option key={province.id} value={province.id}>
                {province.name}
              </option>
            ))}
          </select>
        </div>

        {/* District */}
        <div className="mb-3">
          <label htmlFor="district" className="form-label">District</label>
          <select
            className="form-select"
            id="district"
            value={hotel.districtId}
            onChange={handleDistrictChange}
            disabled={!districts.length}
          >
            <option value="">Select District</option>
            {districts.map((district) => (
              <option key={district.id} value={district.id}>
                {district.name}
              </option>
            ))}
          </select>
        </div>

        {/* Ward */}
        <div className="mb-3">
          <label htmlFor="ward" className="form-label">Ward</label>
          <select
            className="form-select"
            id="ward"
            value={hotel.wardId}
            onChange={handleWardChange}
            disabled={!wards.length}
          >
            <option value="">Select Ward</option>
            {wards.map((ward) => (
              <option key={ward.id} value={ward.id}>
                {ward.name}
              </option>
            ))}
          </select>
        </div>

        {/* Cover Photo */}
        <div className="mb-3">
          <label className="form-label">Cover Photo</label>
          {hotel.coverPhoto && (
            <div className="position-relative" style={{ width: '200px', height: '200px', overflow: 'hidden' }}>
              <img
                src={typeof hotel.coverPhoto === 'string' ? `data:image/jpeg;base64,${hotel.coverPhoto}` : URL.createObjectURL(hotel.coverPhoto)} // Hiển thị ảnh từ base64 hoặc file
                alt="Cover Preview"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '8px',
                }}
              />
            </div>
          )}
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={handleCoverPhotoChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Hotel Photos</label>
          <div>
            {currentPhotos.map((photo, index) => (
              <div
                key={index}
                style={{
                  display: 'inline-block',
                  marginRight: '10px',
                  position: 'relative',
                  width: '200px',
                  height: '200px',
                  overflow: 'hidden',
                }}
              >
                <img
                  src={typeof photo === 'string' ? `data:image/jpeg;base64,${photo}` : URL.createObjectURL(photo)}
                  alt={`Photo ${index + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '8px',
                  }}
                />
                <button
                  type="button"
                  className="btn btn-danger btn-sm position-absolute top-0 end-0"
                  onClick={() => handleDeletePhoto(index)}
                  style={{ zIndex: 1 }}
                >
                  X
                </button>
              </div>
            ))}
            {newPhotos.map((photo, index) => (
              <div
                key={`new_${index}`}
                style={{
                  display: 'inline-block',
                  marginRight: '10px',
                  position: 'relative',
                  width: '200px',
                  height: '200px',
                  overflow: 'hidden',
                }}
              >
                <img
                  src={URL.createObjectURL(photo)} // Hiển thị ảnh mới
                  alt={`New Photo ${index + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '8px',
                  }}
                />
              </div>
            ))}
          </div>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            multiple
            onChange={handleAddPhoto}
          />
        </div>


        <button type="submit" className="btn btn-primary">Update Hotel</button>
      </form>
    </div>
  );
};

export default UpdateHotel;