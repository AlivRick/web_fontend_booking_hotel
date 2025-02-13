import React, { useEffect, useState } from 'react';
import { Button, Modal, TextField, CircularProgress } from '@mui/material';
import { getAllHotelFacilities, addHotelFacility } from '../utils/ApiFunction';

const AddFacilityModal = ({ open, onClose, onAdd }) => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddFacility = async (e) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      setError('Facility name is required');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const addedFacility = await addHotelFacility(formData);
      onAdd(addedFacility); // Gửi dữ liệu mới lên parent để cập nhật danh sách
      setFormData({}); // Reset form sau khi thêm thành công
      onClose();
    } catch (err) {
      setError('Error adding new facility');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} className="modal-container">
      <div className="modal-content">
        <h2>Add New Facility</h2>
        <form onSubmit={handleAddFacility}>
          <TextField
            label="Facility Name"
            variant="outlined"
            fullWidth
            name="name"
            value={formData.name || ''} // Hiển thị giá trị động
            onChange={handleInputChange}
            required
            className="input-field"
            disabled={loading}
          />
          {error && <p className="error-message">{error}</p>}
          <div className="modal-actions">
            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              disabled={loading}
            >
              {loading ? <CircularProgress size={20} /> : 'Add Facility'}
            </Button>
            <Button 
              type="button" 
              variant="outlined" 
              color="secondary" 
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

const AllHotelFacilities = () => {
  const [hotelFacilities, setHotelFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchHotelFacilities = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAllHotelFacilities();
        setHotelFacilities(data);
      } catch (err) {
        setError('Error fetching hotel facilities');
      } finally {
        setLoading(false);
      }
    };

    fetchHotelFacilities();
  }, []);

  const handleAddFacility = (newFacility) => {
    setHotelFacilities((prevFacilities) => [...prevFacilities, newFacility]);
  };

  if (loading) return <div className="loading"><CircularProgress /> Loading hotel facilities...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="hotel-facilities-list">
      <h1 className="title">Hotel Facilities</h1>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={() => setShowModal(true)} 
        className="add-facility-btn"
      >
        Add Facility
      </Button>

      <div className="facility-list">
        {hotelFacilities.map((facility) => (
          <div key={facility.id} className="facility-item">
            <h2>{facility.name}</h2>
          </div>
        ))}
      </div>

      <AddFacilityModal 
        open={showModal} 
        onClose={() => setShowModal(false)} 
        onAdd={handleAddFacility} 
      />
    </div>
  );
};

export default AllHotelFacilities;
