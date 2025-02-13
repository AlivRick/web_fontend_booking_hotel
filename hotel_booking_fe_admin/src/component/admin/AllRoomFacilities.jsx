import React, { useEffect, useState } from 'react';
import { Button, TextField, CircularProgress, Modal } from '@mui/material';
import { getAllRoomFacility, addRoomFacility } from '../utils/ApiFunction';

const AddRoomFacilityModal = ({ open, onClose, onAdd }) => {
  const [formData, setFormData] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    setFormData(e.target.value);
  };

  const handleAddFacility = async (e) => {
    e.preventDefault();
    if (!formData.trim()) {
      setError('Facility name is required');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const addedFacility = await addRoomFacility({ name: formData });
      onAdd(addedFacility); // Send the new facility to the parent for updating the list
      setFormData(''); // Reset form after successful addition
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
        <h2>Add New Room Facility</h2>
        <form onSubmit={handleAddFacility}>
          <TextField
            label="Facility Name"
            variant="outlined"
            fullWidth
            value={formData}
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

const AllRoomFacilities = () => {
  const [roomFacilities, setRoomFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchRoomFacilities = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAllRoomFacility();
        setRoomFacilities(data);
      } catch (err) {
        setError('Error fetching room facilities');
      } finally {
        setLoading(false);
      }
    };

    fetchRoomFacilities();
  }, []);

  const handleAddFacility = (newFacility) => {
    setRoomFacilities((prevFacilities) => [...prevFacilities, newFacility]);
  };

  if (loading) return <div className="loading"><CircularProgress /> Loading room facilities...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="room-facilities-list">
      <h1 className="title">Room Facilities</h1>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={() => setShowModal(true)} 
        className="add-facility-btn"
      >
        Add Facility
      </Button>

      <div className="facility-list">
        {roomFacilities.map((facility) => (
          <div key={facility.id} className="facility-item">
            <h2>{facility.name}</h2>
          </div>
        ))}
      </div>

      <AddRoomFacilityModal 
        open={showModal} 
        onClose={() => setShowModal(false)} 
        onAdd={handleAddFacility} 
      />
    </div>
  );
};

export default AllRoomFacilities;
