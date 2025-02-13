import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8080",
});

export const getHeader = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
    //"Content-Type": "application/json",
    "Content-Type": "multipart/form-data",
  };
};


// lấy dữ liêu room type từ backend (Thuan12Z)
export async function getRoomTypes() {
  try {
    const response = await api.get("/api/room/type", {
      headers: getHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching room types", error);
    throw new Error("Error fetching room types");
  }
}
// This function get all rooms from database
export async function getAllRooms() {
  try {
    const result = await api.get("/rooms/all-rooms");
    console.log(result.data);
    return result.data;
  } catch (error) {
    throw new Error("Error fetching room");
  }
}

//This function deletes a room by id
export async function deleteRoom(roomId) {
  try {
    const result = await api.delete(`/rooms/delete/room/${roomId}`, {
      headers: getHeader(),
    });
    return result.data;
  } catch (error) {
    throw new Error(`Error deleting  room ${error.massage}`);
  }
}


export async function updateRoom(roomId, roomDTO) {
  try {
    const response = await api.put(`/api/rooms/${roomId}`, roomDTO, {
      headers: getHeader(),
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error updating room: ${error.response?.data || error.message}`);
  }
}

export async function getRoomById(roomId) {
  try {
    const response = await api.get(`/api/rooms/update/${roomId}`, {
      headers: getHeader(),
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching room by id: ${error.response?.data || error.message}`);
  }
}

// //This function update a room
// export async function updateRoom(roomId, roomData) {
//   const formData = new FormData();
//   formData.append("roomType", roomData.roomType);
//   formData.append("roomPrice", roomData.roomPrice);
//   formData.append("photo", roomData.photo);
//   const response = await api.put(`/rooms/update/${roomId}`, formData, {
//     headers: getHeader(),
//   });
//   return response;
// }
//This function gets a room by the id
// export async function getRoomById(roomId) {
//   try {
//     const result = await api.get(`/rooms/room/${roomId}`);
//     return result.data;
//   } catch (error) {
//     throw new Error(`Error featching room ${error.massage}`);
//   }
// }
export async function bookRoom(roomId, booking) {
  try {
    const response = await api.post(
      `/bookings/room/${roomId}/booking`,
      booking
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data);
    } else {
      throw new Error(`Error booking room : ${error.massage}`);
    }
  }
}
export async function getAllBookings() {
  try {
    const result = await api.get(`/bookings/hotel/${30}`, {
      headers: getHeader(),
    });
    return result.data;
  } catch (error) {
    throw new Error(`Error fetching bookings : ${error.massage}`);
  }
}
export async function getBookingsByOwner() {
  try {
    const result = await api.get(`/bookings/hotel-owner/bookings`, {
      headers: getHeader(),
    });
    console.log(result);
    return result.data;
  } catch (error) {
    throw new Error(`Error fetching bookings: ${error.message}`); // Sửa 'massage' thành 'message'
  }
}
export async function getBookingByConfirmationCode(confirmationCode) {
  try {
    const result = await api.get(`/bookings/confirmation/${confirmationCode}`);
    return result.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data);
    } else {
      throw new Error(`Error find booking : ${error.message}`);
    }
  }
}
/* This is the function to cancel user booking */
export async function cancelBooking(bookingId) {
  try {
    const result = await api.delete(`/bookings/booking/${bookingId}/delete`);
    return result.data;
  } catch (error) {
    throw new Error(`Error cancelling booking :${error.message}`);
  }
}
// This function register a new user
export async function registerUser(registration) {
  try {
    const response = await api.post("/auth/register-user", registration);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data);
    } else {
      throw new Error(`User registration error:${error.message}`);
    }
  }
}
export async function loginRental(login) {
  try {
    const response = await api.post("/auth/login-rental", login);
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Login failed:", error.response ? error.response.data : error.message);
    return null;
  }
}
export async function getUserProfile(userId, token) {
  try {
    const response = await api.get(`users/profile/${userId}`, {
      headers: getHeader(),
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}
export async function deleteUser(userId) {
  try {
    const response = await api.delete(`/users/delete/${userId}`, {
      headers: getHeader(),
    });
    return response.data;
  } catch (error) {
    return error.message;
  }
}
export async function getUser(userId, token) {
  try {
    const response = await api.get(`/users/${userId}`, {
      headers: getHeader(),
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}
export async function getBookingsByUserId(userId, token) {
  try {
    const response = await api.get(`/bookings/user/${userId}/bookings`, {
      headers: getHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching bookings:", error.message);
    throw new Error("Failed to fetch bookings");
  }
}



// Hàm đăng ký khách sạn
export async function registerHotel(hotelData) {
  try {
    const response = await api.post('/hotels/register', hotelData, {
      headers: getHeader(),
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error registering hotel: ${error.response?.data || error.message}`);
  }
}

//npm install react-responsive-carousel
// API function room by hotel ( Thuan )
export async function getRoomsByHotelId(hotelId) {
  try {
    const response = await api.get(`/api/rooms/${hotelId}`,{
      headers: getHeader(),
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching rooms: ${error.message}`);
  }
}
export async function addRoom(roomData) {
  try { 
    const response = await api.post("/api/rooms", roomData, {
    headers: getHeader(),
  });
  return response.data;
  } catch(error){
    throw new Error(`Error adding room: ${error.response?.data || error.message}`);
  }
}

// API to fetch hotel by ID
export async function getHotelById(hotelId) {
  try {
    const response = await api.get(`/hotels/hotels/${hotelId}`, {
      headers: getHeader(),
    });

    return response.data;
  } catch (error) {
    throw new Error("Error fetching hotel details");
  }
}

export async function getRoomFacilities() {
  try {
    const response = await api.get('/api/roomFacilities', {
      headers: getHeader(),
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching facilities: ${error.response?.data || error.message}`);
  }
}

export async function getFacilities() {
  try {
    const response = await api.get('/api/facilities', {
      headers: getHeader(),
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching facilities: ${error.response?.data || error.message}`);
  }
}

// API to update hotel
export async function updateHotel(hotelId, hotelData) {
  try {
    const response = await api.put(`/hotels/hotels/update/${hotelId}`, hotelData, {
      headers: getHeader(),
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error registering hotel: ${error.response?.data || error.message}`);
  }
}




// Lấy danh sách khách sạn của Rental
  export async function getMyHotels() {
    try {
      const response = await api.get("/hotels/my-hotels", {
        headers: getHeader(),
      });
      return response.data;
    } catch (error) {
      throw new Error(`Error fetching hotels: ${error.response?.data || error.message}`);
    }
  }


// Get pending hotels for admin approval
export async function getPendingHotels() {
  try {
    const response = await api.get(`/hotels/pending`, {
      headers: getHeader(),
    });
    return response.data;
  } catch (error) {
    throw new Error("Error fetching pending hotels");
  }
}

// Approve a hotel (admin only)
export async function approveHotel(hotelId) {
  try {
    const response = await api.put(`/hotels/approve/${hotelId}`, null, {
      headers: getHeader(),
    });
    return response.data;
  } catch (error) {
    throw new Error("Error approving hotel");
  }
}
// apiFunctions.js

// Get provinces
export async function getProvinces() {
  try {
    const response = await api.get("/api/locations/provinces", { headers: getHeader() });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch provinces: ${error.response?.data || error.message}`);
  }
}

// Get districts by province ID
export async function getDistrictsByProvince(provinceId) {
  try {
    const response = await api.get(`/api/locations/districts`, {
      params: { provinceId },
      headers: getHeader(),
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch districts: ${error.response?.data || error.message}`);
  }
}

// Get wards by district ID
export async function getWardsByDistrict(districtId) {
  try {
    const response = await api.get(`/api/locations/wards`, {
      params: { districtId },
      headers: getHeader(),
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch wards: ${error.response?.data || error.message}`);
  }
}
export async function getAvailableRooms(hotelId, checkInDate, checkOutDate) {
  try {
    const response = await api.get(
      `/api/hotels/${hotelId}/available-rooms?checkInDate=${checkInDate}&checkOutDate=${checkOutDate}`, {
        headers: getHeader(),
      });
    return response.data;
  } catch (error) {
    throw new Error("Error fetching available rooms");
  }
}

export async function search(keyword) {
  try {
    const response = await api.get(
      `/api/search/autocomplete?query=${keyword}`, {
        headers: getHeader()
      }
    );
    return response.data; // Trả về danh sách khách sạn
  } catch (error) {
    throw new Error("Error fetching hotels");
  }
}
export async function checkInBooking(bookingcode) {
  try {
    const response = await api.post(`/bookings/checkin?bookingCode=${bookingcode}`, {}, {
      headers: getHeader()
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error checking in booking: ${error.message}`);
  }
}
export async function confirmBooking(bookingId) {
  try {
    const response = await api.put(`/bookings/confirm?bookingId=${bookingId}`, {}, {
      headers: getHeader(),  // Đảm bảo bạn truyền đúng header với token
    });

    if (response.status === 200) {
      return true;
    } else {
      alert("Lỗi khi xác nhận booking: " + response.data);
      return false;
    }
  } catch (error) {
    console.error("Error confirming booking: ", error.response || error.message);
    alert("Lỗi khi xác nhận booking: " + error.message);
    return false;
  }
}
export async function registerRental(rentalData) {
  try {
    const response = await api.post("/api/rental/register", rentalData);  // Đường dẫn mới cho rental
    console.log(rentalData);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data);
    } else {
      throw new Error(`Rental account registration error: ${error.message}`);
    }
  }
}
export async function getRevenueForAllHotels(year) {
  try {
    const response = await api.get(`/api/revenue/user/${year}`,{
      headers: getHeader(),
    });
    return response.data;
  } catch (error) {
    throw new Error("Error fetching revenue data for user's hotels: " + error.message);
  }
}

