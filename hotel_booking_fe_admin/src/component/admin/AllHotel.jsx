import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { getAllHotel, getProvinces, getDistrictsByProvince, getWardsByDistrict } from '../utils/ApiFunction'; // Đảm bảo đường dẫn đúng đến file api

const AllHotel = () => {
    const [hotels, setHotels] = useState([]);
    const [filteredHotels, setFilteredHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedWard, setSelectedWard] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL'); // Trạng thái lọc

    useEffect(() => {
        setSelectedDistrict('');
        setSelectedWard('');
    }, [selectedProvince]);

    useEffect(() => {
        setSelectedWard('');
    }, [selectedDistrict]);

    useEffect(() => {
        const fetchHotels = async () => {
            try {
                const data = await getAllHotel();
                setHotels(data);
                setFilteredHotels(data); // Khởi tạo danh sách đã lọc
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchHotels();
    }, []);

    useEffect(() => {
        const fetchProvinces = async () => {
            const data = await getProvinces();
            setProvinces(data);
        };
        fetchProvinces();
    }, []);

    useEffect(() => {
        if (selectedProvince) {
            const fetchDistricts = async () => {
                const data = await getDistrictsByProvince(selectedProvince);
                setDistricts(data);
            };
            fetchDistricts();
        } else {
            setDistricts([]);
        }
    }, [selectedProvince]);

    useEffect(() => {
        if (selectedDistrict) {
            const fetchWards = async () => {
                const data = await getWardsByDistrict(selectedDistrict);
                setWards(data);
            };
            fetchWards();
        } else {
            setWards([]);
        }
    }, [selectedDistrict]);

    useEffect(() => {
        const filtered = hotels.filter(hotel => {
            const matchesName = hotel.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesDistrict = selectedDistrict
                ? hotel.ward?.district?.id?.toString() === selectedDistrict.toString()
                : true;
            const matchesWard = selectedWard
                ? hotel.ward?.id?.toString() === selectedWard.toString()
                : true;
            const matchesProvince = selectedProvince
                ? hotel.ward?.district?.province?.id?.toString() === selectedProvince.toString()
                : true;
            const matchesStatus = statusFilter === 'ALL'
                ? true
                : hotel.status === statusFilter;

            return matchesStatus && matchesName && matchesDistrict && matchesWard && matchesProvince;
        });
        setFilteredHotels(filtered);
    }, [searchTerm, selectedProvince, selectedDistrict, selectedWard, hotels, statusFilter]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="hotel-container">
            <h1 className="title">All Hotels</h1>
            <div className="filters">
                {/* Filters */}
                <div className="filter-group">
                    <label htmlFor="filter">Filter by status: </label>
                    <select id="filter" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                        <option value="ALL">All</option>
                        <option value="PENDING">Pending</option>
                        <option value="APPROVED">Approved</option>
                        <option value="REJECTED">Rejected</option>
                    </select>
                </div>

                <div className="filter-group">
                    <label htmlFor="province">Select Province: </label>
                    <select id="province" value={selectedProvince} onChange={(e) => setSelectedProvince(e.target.value)}>
                        <option value="">All Provinces</option>
                        {provinces.map(province => (
                            <option key={province.id} value={province.id}>{province.name}</option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <label htmlFor="district">Select District: </label>
                    <select id="district" value={selectedDistrict} onChange={(e) => setSelectedDistrict(e.target.value)} disabled={!selectedProvince}>
                        <option value="">All Districts</option>
                        {districts.map(district => (
                            <option key={district.id} value={district.id}>{district.name}</option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <label htmlFor="ward">Select Ward: </label>
                    <select id="ward" value={selectedWard} onChange={(e) => setSelectedWard(e.target.value)} disabled={!selectedDistrict}>
                        <option value="">All Wards</option>
                        {wards.map(ward => (
                            <option key={ward.id} value={ward.id}>{ward.name}</option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <input
                        type="text"
                        placeholder="Search hotels..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="hotel-list">
                {filteredHotels.map((hotel) => (
                    <div className="hotel-card" key={hotel.id}>
                        <h2 className="hotel-name">{hotel.name}</h2>
                        <p className={`status-${hotel.status.toLowerCase()}`}>
                            Status: {hotel.status}
                        </p>
                        <p>Phone: {hotel.phoneNumber}</p>
                        <p>Email: {hotel.email}</p>
                        <p>Description: {hotel.description}</p>
                        <p>Star Rating: {hotel.starRating}</p>
                        <Link to={`/hoteldetails/${hotel.id}`} className="view-details-button">
                            View Details
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AllHotel;
