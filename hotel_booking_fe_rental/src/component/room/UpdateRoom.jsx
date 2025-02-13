import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Select from 'react-select';
import { useParams } from 'react-router-dom';
import { getRoomById, updateRoom, getRoomTypes, getRoomFacilities } from "../utils/ApiFunction"; 
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';

const UpdateRoom = () => {
    const { roomId } = useParams();
    const [room, setRoom] = useState(null);
    const [roomTypes, setRoomTypes] = useState([]);
    const [facilities, setFacilities] = useState([]);
    const [selectedFacilities, setSelectedFacilities] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [newPhotos, setNewPhotos] = useState([]);
    const { register, handleSubmit, setValue } = useForm();

    // Tạo danh sách tỷ lệ phần trăm
    const depositOptions = Array.from({ length: 21 }, (_, i) => ({
        value: i * 5,
        label: `${i * 5}%`,
    }));

    useEffect(() => {
        const fetchRoomData = async () => {
            try {
                const roomData = await getRoomById(roomId);
                const types = await getRoomTypes();
                const facilitiesData = await getRoomFacilities();

                setRoom(roomData);
                setRoomTypes(types);
                setFacilities(facilitiesData);

                setValue('name', roomData.name);
                setValue('roomPrice', roomData.roomPrice);
                setValue('quantity', roomData.quantity);
                setValue('roomTypeId', roomData.roomTypeDetails.id);
                setValue('depositPercentage', roomData.depositPercentage * 100); // Thiết lập depositPercentage

                setSelectedFacilities(
                    roomData.facilityDetails.map((facility) => ({
                        value: facility.id,
                        label: facility.name,
                    }))
                );
                console.log(roomData);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchRoomData();
    }, [roomId, setValue]);

    const onSubmit = async (formData) => {
        try {
            const updatedData = new FormData();
            updatedData.append('name', formData.name);
            updatedData.append('roomPrice', formData.roomPrice);
            updatedData.append('quantity', formData.quantity);
            updatedData.append('roomTypeId', formData.roomTypeId);
            updatedData.append('depositPercentage', formData.depositPercentage / 100); // Chia cho 100 trước khi gửi

            selectedFacilities.forEach(facility => {
                updatedData.append('facilityIds[]', facility.value);
            });
            if (newPhotos.length > 0) {
                newPhotos.forEach(photo => {
                    updatedData.append('photos', photo);
                });
            }

            await updateRoom(roomId, updatedData);
            setSuccess('Room updated successfully!');
            setError(null);
        } catch (err) {
            setError(`Error updating room: ${err.message}`);
            setSuccess(null);
        }
    };

    const handlePhotoChange = (event) => {
        const files = event.target.files;
        if (files.length > 0) {
            setNewPhotos(Array.from(files));
        }
    };

    if (error) {
        return <Alert variant="danger">{error}</Alert>;
    }

    if (!room) {
        return <div>Loading...</div>;
    }

    return (
        <Container>
            <h1 className="mt-4">Update Room</h1>
            {success && <Alert variant="success">{success}</Alert>}
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Row className="mb-3">
                    <Col md={6}>
                        <Form.Group controlId="name">
                            <Form.Label>Room Name</Form.Label>
                            <Form.Control type="text" {...register('name', { required: true })} />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group control Id="roomPrice">
                            <Form.Label>Room Price</Form.Label>
                            <Form.Control type="number" {...register('roomPrice', { required: true })} />
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col md={6}>
                        <Form.Group controlId="quantity">
                            <Form.Label>Quantity</Form.Label>
                            <Form.Control type="number" {...register('quantity', { required: true })} />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="roomTypeId">
                            <Form.Label>Room Type</Form.Label>
                            <Form.Control as="select" {...register('roomTypeId', { required: true })}>
                                {roomTypes.map((type) => (
                                    <option key={type.id} value={type.id}>
                                        {type.name}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col md={6}>
                        <Form.Group controlId="depositPercentage">
                            <Form.Label>Deposit Percentage (%)</Form.Label>
                            <Select
                                options={depositOptions}
                                onChange={(selectedOption) => setValue('depositPercentage', selectedOption.value)}
                                defaultValue={depositOptions.find(option => option.value === room.depositPercentage * 100)}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label>Facilities</Form.Label>
                            <Select
                                options={facilities.map((facility) => ({
                                    value: facility.id,
                                    label: facility.name,
                                }))}
                                isMulti
                                value={selectedFacilities}
                                onChange={(selectedOptions) => setSelectedFacilities(selectedOptions)}
                                placeholder="Select facilities..."
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col md={12}>
                        <Form.Group controlId="photos">
                            <Form.Label>Photos</Form.Label>
                            <Form.Control type="file" {...register('photos')} multiple onChange={handlePhotoChange} />
                        </Form.Group>
                    </Col>
                </Row>
                <Button variant="primary" type="submit">Update Room</Button>
            </Form>

            <div className="mt-4">
                <h2>New Photos</h2>
                <div>
                    {newPhotos.length > 0 ? (
                        newPhotos.map((photo, index) => (
                            <img
                                key={index}
                                src={URL.createObjectURL(photo)}
                                alt={`New Room Photo ${index + 1}`}
                                style={{ width: '100px', marginRight: '10px' }}
                            />
                        ))
                    ) : (
                        room.photos.map((photo, index) => (
                            <img
                                key={index}
                                src={`data:image/jpeg;base64,${photo}`}
                                alt={`Room photo ${index + 1}`}
                                style={{ width: '100px', marginRight: '10px' }}
                            />
                        ))
                    )}
                </div>
            </div>
        </Container>
    );
};

export default UpdateRoom;