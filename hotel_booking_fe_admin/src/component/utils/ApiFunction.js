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

export async function addRoom(photo, roomType, roomPrice) {
  const formData = new FormData();
  formData.append("photo", photo);
  formData.append("roomType", roomType);
  formData.append("roomPrice", roomPrice);

  const response = await api.post("/rooms/add/new-room", formData, {
    headers: getHeader(),
  });

  return response.status === 201;
}

export async function getRoomTypes() {
  try {
    const response = await api.get("/rooms/room/types");
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
//This function update a room
export async function updateRoom(roomId, roomData) {
  const formData = new FormData();
  formData.append("roomType", roomData.roomType);
  formData.append("roomPrice", roomData.roomPrice);
  formData.append("photo", roomData.photo);
  const response = await api.put(`/rooms/update/${roomId}`, formData, {
    headers: getHeader(),
  });
  return response;
}
//This function gets a room by the id
export async function getRoomById(roomId) {
  try {
    const result = await api.get(`/rooms/room/${roomId}`);
    return result.data;
  } catch (error) {
    throw new Error(`Error featching room ${error.massage}`);
  }
}
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
    const result = await api.get("/bookings/all-bookings", {
      headers: getHeader(),
    });
    return result.data;
  } catch (error) {
    throw new Error(`Error fetching bookings : ${error.massage}`);
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
// This function gets all available room from the database
export async function getAvailableRooms(checkInDate, checkOutDate, roomType) {
  const results = await api.get(
    `/rooms/available-rooms?checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&roomType=${roomType}`
  );
  return results;
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
export async function loginAdmin(login) {
  try {
    const response = await api.post("/auth/admin-login", login); // Gọi endpoint login dành cho admin
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error logging in as admin", error);
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
// API lấy danh sách khách sạn PENDING
export async function getPendingHotels() {
  try {
    const response = await api.get("/hotels/pending", { headers: getHeader() });
    console.log(response);
    return response.data;
  } catch (error) {
    throw new Error("Error fetching pending hotels: " + error.message);
  }
}

export async function approveHotel(hotelId) {
  try {
    const response = await api.put(`/hotels/approve/${hotelId}`, {}, {
      headers: getHeader(), // Nếu cần thêm header như JWT token
    });
    return response.data;
  } catch (error) {
    console.error("Error approving hotel:", error);
    throw new Error(error.message);
  }
}
// API từ chối khách sạn
export async function rejectHotel(hotelId) {
  try {
    const response = await api.put(`/hotels/reject/${hotelId}`, {},
      { headers: getHeader() });
    return response.data;
  } catch (error) {
    throw new Error("Error rejecting hotel: " + error.message);
  }
}

export async function getAllHotel() {
  try {
    const response = await api.get(`/hotels/all`, {
      headers: getHeader(),
    });
    console.log(response);
    return response.data;
  } catch (error) {
    throw new Error("Error rejecting hotel: " + error.message);
  }
}
export async function getProvinces() {
  try {
    const response = await api.get("/api/locations/provinces", { headers: getHeader() });
    console.log(response);
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

export async function getAllHotelFacilities() {
  try {
    const response = await api.get(`/api/facilities`, {
      headers: getHeader(),
    });
    return response.data;
  } catch (error) {
    throw new Error("Error fetching hotel details");
  }
}
export async function addHotelFacility(facility) {
  try {
    const response = await api.post(`/api/facilities`, facility, {
      headers: getHeader()
    });
    return response.data;
  } catch (error) {
    console.error("Error approving hotel:", error);
    throw new Error(error.message);
  }
}
export async function getAllRoomFacility() {
  try {
    const response = await api.get(`/api/roomFacilities`, {
      headers: getHeader(),
    });
    return response.data;
  } catch (error) {
    throw new Error("Error fetching hotel details");
  }
}
export async function addRoomFacility(facility) {
  try {
    const response = await api.post(`/api/roomFacilities`, facility, {
      headers: getHeader()
    });
    return response.data;
  } catch (error) {
    console.error("Error approving hotel:", error);
    throw new Error(error.message);
  }
}

export async function getAllUser() {
  try {
    const response = await api.get(`/users/all`, {
      headers: getHeader(),
    });
    return response.data; // Return the user data directly
  } catch (error) {
    throw new Error("Error fetching users"); // More specific error message
  }
}

export async function getAllBooking() {
  try {
    const response = await api.get(`/admin/bookings`, {
      headers: getHeader(),
    });
    console.log(response);
    return response.data;
  } catch (error) {
    throw new Error(`Error getting booking ${error.message}`);
  }
}
export async function updateBookingStatus(bookingId, status) {
  try {
    const response = await api.put(`/admin/bookings/${bookingId}/status`, {}, {
      params: { status: status },
      headers: getHeader(),
    });

    return response.data;  // Trả về dữ liệu của booking sau khi cập nhật
  } catch (error) {
    throw new Error(`Error updating booking status: ${error.message}`);
  }
}

export async function getRentals() {
  try {
    const response = await api.get("/api/rental",{
      headers: getHeader(),  // Đảm bảo bạn truyền đúng header với token
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response ? error.response.data : error.message);
  }
}

// Hàm duyệt rental
export async function approveRental(id) {
  try {
    const response = await api.post(`/api/rental/approve/${id}`,{}, {
      headers: getHeader(),  // Đảm bảo bạn truyền đúng header với token
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response ? error.response.data : error.message);
  }
}

export async function getRevenueForAllHotels(year) {
  try {
    const response = await api.get(`/api/revenue/all/${year}`,{
      headers: getHeader()
    });
    return response.data;
  } catch (error) {
    throw new Error("Error fetching revenue data for all hotels: " + error.message);
  }
}

// Get revenue data for a user's hotels for a specific year
export async function getRevenueForUserHotels(year, userId) {
  try {
    const response = await api.get(`/api/revenue/user?year=${year}`, {},{
      headers: getHeader(),
      params: { userId },
    });
    return response.data;
  } catch (error) {
    throw new Error("Error fetching revenue data for user's hotels: " + error.message);
  }
}