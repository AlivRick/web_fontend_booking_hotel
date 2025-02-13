import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import * as XLSX from "xlsx"; // Import thư viện XLSX để xuất Excel
import { getRevenueForAllHotels } from "../utils/ApiFunction"; // Nhập API function

// Nhập các thành phần cần thiết từ chart.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Đăng ký các thành phần cần thiết
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Admin = () => {
  const [year, setYear] = useState(new Date().getFullYear()); // Đặt năm là năm hiện tại
  const [chartData, setChartData] = useState(null);
  const [revenues, setRevenues] = useState([]);

  // Hàm xử lý lấy dữ liệu doanh thu
  useEffect(() => {
    const fetchData = async () => {
      try {
        const hotelsRevenues = await getRevenueForAllHotels(year); // Lấy dữ liệu doanh thu cho năm đã chọn

        // Khởi tạo mảng labels cho các tháng trong năm
        const labels = Array.from({ length: 12 }, (_, i) => `Tháng ${i + 1}`);

        // Dữ liệu cho các đường trong biểu đồ
        const datasets = hotelsRevenues.map((hotel) => {
          // Tạo dữ liệu doanh thu cho từng khách sạn
          const data = hotel.monthlyRevenues.map((revenue) => revenue.totalRevenue);

          return {
            label: hotel.hotelName, // Tên khách sạn sẽ là tên của đường trong biểu đồ
            data,
            borderColor: getRandomColor(), // Tạo màu ngẫu nhiên cho mỗi đường
            backgroundColor: getRandomColor(0.2), // Màu nền của đường với độ trong suốt
            fill: true,
          };
        });

        setChartData({
          labels,
          datasets,
        });

        setRevenues(hotelsRevenues); // Lưu dữ liệu doanh thu vào state
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchData(); // Lấy dữ liệu khi component được mount và khi `year` thay đổi
  }, [year]); // Dependency array để trigger lại fetch khi `year` thay đổi

  // Hàm tạo màu ngẫu nhiên
  const getRandomColor = (opacity = 1) => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  // Hàm xuất dữ liệu thành file Excel
  const exportToExcel = () => {
    const data = [];
    revenues.forEach((hotel) => {
      hotel.monthlyRevenues.forEach((revenue) => {
        data.push({
          Hotel: hotel.hotelName,
          Month: revenue.month,
          Year: revenue.year,
          Revenue: revenue.totalRevenue,
        });
      });
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Revenue Report");
    XLSX.writeFile(wb, `Doanh_Thu_${year}.xlsx`);
  };

  if (!chartData) return <p>Đang tải...</p>;

  return (
    <section className="container mt-5">
      <h2>Welcome to Rental Panel</h2>

      {/* Dropdown để chọn năm */}
      <div className="mb-4">
        <label htmlFor="year" className="mr-2">Chọn năm:</label>
        <select
          id="year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="form-select"
        >
          {[...Array(10)].map((_, index) => {
            const optionYear = new Date().getFullYear() - index;
            return (
              <option key={optionYear} value={optionYear}>
                {optionYear}
              </option>
            );
          })}
        </select>
      </div>

      {/* Biểu đồ doanh thu cho tất cả các khách sạn */}
      <div className="chart-container mb-4">
        <Line data={chartData} />
      </div>

      {/* Nút xuất báo cáo */}
      <button onClick={exportToExcel} className="btn btn-success mt-4">
        Xuất Báo Cáo Excel
      </button>
    </section>
  );
};

export default Admin;
