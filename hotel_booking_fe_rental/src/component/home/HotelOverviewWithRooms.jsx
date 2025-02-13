import React, { useState, useEffect } from "react";
import { getHotelById, getAvailableRooms, search } from "../utils/ApiFunction";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Autocomplete,
  TextField,
  CircularProgress,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Grid,
  Container,
} from "@mui/material";

function HotelOverviewWithRooms() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [hotelName, setHotelName] = useState("");
  const [hotelId, setHotelId] = useState(null);
  const [checkInDate, setCheckInDate] = useState(new Date());
  const [checkOutDate, setCheckOutDate] = useState(new Date(new Date().setDate(new Date().getDate() + 1)));
  const [hotelDetails, setHotelDetails] = useState(null);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!query) {
        setSuggestions([]);
        return;
      }
      try {
        setLoading(true);
        const response = await search(query);
        setSuggestions(response);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };
    const debounceFetch = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceFetch);
  }, [query]);

  const onSuggestionSelected = (event, newValue) => {
    if (newValue) {
      setHotelName(newValue.name);
      setHotelId(newValue.id);
    } else {
      setHotelName("");
      setHotelId(null);
    }
  };

  const handleSearch = async () => {
    try {
      if (!hotelId || !checkInDate || !checkOutDate) {
        alert("Vui lòng nhập đầy đủ thông tin tìm kiếm!");
        return;
      }
      const checkInFormatted = checkInDate.toISOString().split("T")[0];
      const checkOutFormatted = checkOutDate.toISOString().split("T")[0];
      setLoading(true);
      const roomsResponse = await getAvailableRooms(hotelName, checkInFormatted, checkOutFormatted);
      const hotelResponse = await getHotelById(roomsResponse.hotelId);
      setHotelDetails(hotelResponse);
      setAvailableRooms(roomsResponse.availableRooms);
    } catch (error) {
      console.error("Error fetching data:", error.message);
      alert("Không tìm thấy khách sạn hoặc có lỗi xảy ra.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ marginTop: 4 }}>
      {/* Search Bar */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "#fff",
          borderRadius: "50px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
          padding: "4px 8px",
          gap: "8px",
        }}
      >
        {/* Autocomplete Section */}
        <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
          <Typography
            sx={{
              color: "#007BFF",
              marginRight: "8px",
              fontSize: "1.5rem",
            }}
          >
            📍
          </Typography>
          <Autocomplete
            value={suggestions.find((option) => option.name === hotelName) || null}
            onChange={onSuggestionSelected}
            inputValue={query}
            onInputChange={(event, newInputValue) => setQuery(newInputValue)}
            options={suggestions}
            getOptionLabel={(option) => option.name || ""}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Nhập tên khách sạn"
                variant="standard"
                InputProps={{
                  ...params.InputProps,
                  disableUnderline: true,
                  style: { fontSize: "1rem", color: "#333" },
                }}
              />
            )}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            sx={{ width: "100%" }}
          />
        </Box>

        {/* Date Picker Section */}
        <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
          <Typography
            sx={{
              color: "#007BFF",
              marginRight: "8px",
              fontSize: "1.5rem",
            }}
          >
            📅
          </Typography>
          <DatePicker
            selected={checkInDate}
            onChange={setCheckInDate}
            minDate={new Date()}
            dateFormat="dd/MM/yyyy"
            customInput={
              <TextField
                variant="standard"
                placeholder="Ngày nhận phòng"
                InputProps={{
                  disableUnderline: true,
                  style: { fontSize: "1rem", color: "#333" },
                }}
              />
            }
          />
          <Typography sx={{ mx: "8px", color: "#888" }}>-</Typography>
          <DatePicker
            selected={checkOutDate}
            onChange={setCheckOutDate}
            minDate={checkInDate}
            dateFormat="dd/MM/yyyy"
            customInput={
              <TextField
                variant="standard"
                placeholder="Ngày trả phòng"
                InputProps={{
                  disableUnderline: true,
                  style: { fontSize: "1rem", color: "#333" },
                }}
              />
            }
          />
        </Box>

        {/* Guest Section */}
        <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
          <Typography
            sx={{
              color: "#007BFF",
              marginRight: "8px",
              fontSize: "1.5rem",
            }}
          >
            👤
          </Typography>
          <Typography sx={{ fontSize: "1rem", color: "#333" }}>
            1 người lớn, 0 trẻ em, 1 phòng
          </Typography>
        </Box>

        {/* Search Button */}
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#FF5A5F",
            color: "#fff",
            borderRadius: "50%",
            minWidth: "56px",
            height: "56px",
            "&:hover": { backgroundColor: "#e14b4f" },
          }}
          onClick={handleSearch}
        >
          🔍
        </Button>
      </Box>

      {/* Loading State */}
      {loading && (
        <Box display="flex" justifyContent="center" alignItems="center">
          <CircularProgress />
          <Typography>Đang tìm kiếm...</Typography>
        </Box>
      )}

      <Grid container spacing={4}>
        {/* Thông tin khách sạn */}
        {hotelDetails && (
          <Grid item xs={12}>
            <Card sx={{ boxShadow: 3 }}>
              <Grid container spacing={2} sx={{ marginTop: 2 }}>
                {/* Ảnh chính */}
                <Grid item xs={12} md={8}>
                  <Card sx={{ boxShadow: 2 }}>
                    <CardMedia
                      component="img"
                      height="300"
                      image={`data:image/jpeg;base64,${hotelDetails.photo}`}
                      alt="Ảnh khách sạn chính"
                    />
                  </Card>
                </Grid>

                {/* Các ảnh phụ */}
                <Grid item xs={12} md={4}>
                  <Grid container spacing={2}>
                    {hotelDetails.photos && hotelDetails.photos.map((photo, index) => (
                      <Grid item xs={12} key={index}>
                        <Card sx={{ boxShadow: 2 }}>
                          <CardMedia
                            component="img"
                            height="180"
                            image={`data:image/jpeg;base64,${photo}`}
                            alt={`Ảnh phụ ${index + 1}`}
                          />
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              </Grid>
              <CardContent>
                <Typography variant="h4" gutterBottom>
                  {hotelDetails.name}
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  {hotelDetails.description}
                </Typography>
                <Typography>
                  <strong>Địa chỉ:</strong> {hotelDetails.street}, {hotelDetails.wardName}, {hotelDetails.districtName}, {hotelDetails.provinceName}
                </Typography>
                <Typography>
                  <strong>Email:</strong> {hotelDetails.email}
                </Typography>
                <Typography>
                  <strong>Số điện thoại:</strong> {hotelDetails.phoneNumber}
                </Typography>
                <Typography>
                  <strong>Tiện ích:</strong> {hotelDetails.facilityNames.join(", ")}
                </Typography>

                {/* Hiển thị ảnh chính và ảnh phụ kế bên nhau */}

              </CardContent>
            </Card>
          </Grid>
        )}


        {/* Danh sách phòng còn trống */}
        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom>
            Phòng còn trống
          </Typography>
          <Grid container spacing={2}>
            {availableRooms.map((room) => (
              <Grid item xs={12} md={4} key={room.id}>
                <Card sx={{ boxShadow: 3 }}>
                  <CardMedia
                    component="img"
                    height="180"
                    image={`data:image/jpeg;base64,${room.photos[0]}`}
                    alt={room.name}
                  />
                  <CardContent>
                    <Typography variant="h6">{room.name}</Typography>
                    <Typography><strong>Loại phòng:</strong> {room.roomType}</Typography>
                    <Typography><strong>Giá:</strong> {room.roomPrice.toLocaleString()} VND</Typography>
                    <Typography><strong>Số lượng:</strong> {room.quantity}</Typography>
                    <Typography>
                      <strong>Tiện ích:</strong>{" "}
                      {room.facilityDetails.map((facility) => facility.name).join(", ")}
                    </Typography>
                    <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                      Đặt phòng
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>

    </Container>
  );
}

export default HotelOverviewWithRooms;
