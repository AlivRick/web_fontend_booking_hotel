import React, { useState, useEffect } from "react";
import {
  registerHotel,
  getProvinces,
  getDistrictsByProvince,
  getWardsByDistrict,
  getFacilities,
} from "../utils/ApiFunction";
import Select from "react-select";

const HotelRegistration = () => {
  const [hotel, setHotel] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    description: "",
    provinceId: "",
    districtId: "",
    wardId: "",
    street: "",
    coverPhoto: null,
    photos: [],
  });

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState({
    provinces: true,
    districts: false,
    wards: false,
  });

  const [coverPhotoPreview, setCoverPhotoPreview] = useState(null);
  const [photosPreview, setPhotosPreview] = useState([]);
  const [facilities, setFacilities] = useState([]); // Facility options
  const [selectedFacilities, setSelectedFacilities] = useState([]); // Selected facility IDs

  useEffect(() => {
    async function fetchProvinces() {
      try {
        const provinceData = await getProvinces();
        setProvinces(provinceData);
        setLoading((prev) => ({ ...prev, provinces: false }));
      } catch (error) {
        console.error("Error fetching provinces:", error);
        setLoading((prev) => ({ ...prev, provinces: false }));
      }
    }
    async function fetchFacilities() {
      try {
        const facilityData = await getFacilities();
        setFacilities(facilityData);
      } catch (error) {
        console.error("Error fetching facilities:", error);
      }
    }
    fetchFacilities();


    fetchProvinces();
  }, []);

  const handleProvinceChange = async (selectedOption) => {
    const provinceId = selectedOption ? selectedOption.value : "";
    setHotel((prev) => ({ ...prev, provinceId, districtId: "", wardId: "" }));
    setDistricts([]);
    setWards([]);
    if (provinceId) {
      setLoading((prev) => ({ ...prev, districts: true }));
      try {
        const districtData = await getDistrictsByProvince(provinceId);
        setDistricts(districtData);
        setLoading((prev) => ({ ...prev, districts: false }));
      } catch (error) {
        console.error("Error fetching districts:", error);
        setLoading((prev) => ({ ...prev, districts: false }));
      }
    }
  };

  const handleDistrictChange = async (selectedOption) => {
    const districtId = selectedOption ? selectedOption.value : "";
    setHotel((prev) => ({ ...prev, districtId, wardId: "" }));
    setWards([]);
    if (districtId) {
      setLoading((prev) => ({ ...prev, wards: true }));
      try {
        const wardData = await getWardsByDistrict(districtId);
        setWards(wardData);
        setLoading((prev) => ({ ...prev, wards: false }));
      } catch (error) {
        console.error("Error fetching wards:", error);
        setLoading((prev) => ({ ...prev, wards: false }));
      }
    }
  };

  const handleWardChange = (selectedOption) => {
    setHotel((prev) => ({ ...prev, wardId: selectedOption ? selectedOption.value : "" }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHotel((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "coverPhoto") {
      const file = files[0];
      setHotel((prev) => ({ ...prev, coverPhoto: file }));
      setCoverPhotoPreview(URL.createObjectURL(file));
    } else if (name === "photos") {
      const selectedPhotos = Array.from(files);
      setHotel((prev) => ({ ...prev, photos: selectedPhotos }));
      setPhotosPreview(selectedPhotos.map((file) => URL.createObjectURL(file)));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", hotel.name);
      formData.append("email", hotel.email);
      formData.append("phoneNumber", hotel.phoneNumber);
      formData.append("description", hotel.description);
      formData.append("provinceId", hotel.provinceId);
      formData.append("districtId", hotel.districtId);
      formData.append("wardId", hotel.wardId);
      formData.append("street", hotel.street);
      formData.append("coverPhoto", hotel.coverPhoto);

      hotel.photos.forEach((photo) => {
        formData.append("photos", photo);
      });

      selectedFacilities.forEach((facilityId) => {
        formData.append("facilityIds", facilityId); // Append each facility ID
      });

      const response = await registerHotel(formData);
      alert("Hotel registered successfully");
    } catch (error) {
      alert(`Error registering hotel: ${error.message}`);
    }
  };

  const formatOptions = (data) => {
    return data.map((item) => ({
      value: item.id,
      label: item.name,
    }));
  };


  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Hotel Registration</h2>
      <form onSubmit={handleSubmit} className="bg-light p-4 rounded shadow-sm">
        {/* Hotel Name */}
        <div className="mb-3">
          <label className="form-label">Hotel Name</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={hotel.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Email */}
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={hotel.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Phone Number */}
        <div className="mb-3">
          <label className="form-label">Phone Number</label>
          <input
            type="text"
            className="form-control"
            name="phoneNumber"
            value={hotel.phoneNumber}
            onChange={handleChange}
            required
          />
        </div>

        {/* Description */}
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            name="description"
            value={hotel.description}
            onChange={handleChange}
            rows="3"
            required
          />
        </div>

        {/* Province */}
        <div className="mb-3">
          <label className="form-label">Province</label>
          <Select
            options={formatOptions(provinces)}
            onChange={handleProvinceChange}
            getOptionLabel={(e) => e.label}
            getOptionValue={(e) => e.value}
            isLoading={loading.provinces}
            placeholder="Start typing to search..."
            required
          />
        </div>

        {/* District */}
        <div className="mb-3">
          <label className="form-label">District</label>
          <Select
            options={formatOptions(districts)}
            onChange={handleDistrictChange}
            getOptionLabel={(e) => e.label}
            getOptionValue={(e) => e.value}
            isLoading={loading.districts}
            isDisabled={!hotel.provinceId || loading.districts}
            placeholder="Start typing to search..."
            required
          />
        </div>

        {/* Ward */}
        <div className="mb-3">
          <label className="form-label">Ward</label>
          <Select
            options={formatOptions(wards)}
            onChange={handleWardChange}
            getOptionLabel={(e) => e.label}
            getOptionValue={(e) => e.value}
            isLoading={loading.wards}
            isDisabled={!hotel.districtId || loading.wards}
            placeholder="Start typing to search..."
            required
          />
        </div>

        {/* Street */}
        <div className="mb-3">
          <label className="form-label">Street</label>
          <input
            type="text"
            className="form-control"
            name="street"
            value={hotel.street}
            onChange={handleChange}
            required
          />
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

        {/* Cover Photo */}
        <div className="mb-3">
          <label className="form-label">Cover Photo</label>
          <input
            type="file"
            className="form-control"
            name="coverPhoto"
            accept="image/*"
            onChange={handleFileChange}
            required
          />
          {coverPhotoPreview && (
            <div className="mt-3">
              <img src={coverPhotoPreview} alt="Cover Preview" style={{ width: "200px", borderRadius: "8px" }} />
            </div>
          )}
        </div>

        {/* Other Photos */}
        <div className="mb-3">
          <label className="form-label">Other Photos</label>
          <input
            type="file"
            className="form-control"
            name="photos"
            accept="image/*"
            multiple
            onChange={handleFileChange}
          />
          {photosPreview.length > 0 && (
            <div className="mt-3 d-flex flex-wrap">
              {photosPreview.map((preview, index) => (
                <img key={index} src={preview} alt={`Preview ${index}`} style={{ width: "100px", marginRight: "10px", borderRadius: "8px" }} />
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn btn-primary w-100 mt-4">
          Register Hotel
        </button>
      </form>
    </div>
  );
};

export default HotelRegistration;
