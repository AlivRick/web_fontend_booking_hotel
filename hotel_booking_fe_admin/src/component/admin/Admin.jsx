import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Line } from "react-chartjs-2";
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

  // Hàm xử lý lấy dữ liệu doanh thu
  useEffect(() => {
    const fetchData = async () => {
      try {
        const revenues = await getRevenueForAllHotels(year); // Lấy dữ liệu doanh thu cho năm đã chọn
        const labels = revenues.map((r) => `Tháng ${r.month}`);
        const data = revenues.map((r) => r.totalRevenue);

        setChartData({
          labels,
          datasets: [
            {
              label: `Doanh thu năm ${year} cho tất cả các khách sạn`,
              data,
              borderColor: "rgba(75, 192, 192, 1)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              fill: true,
            },
          ],
        });
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchData(); // Lấy dữ liệu khi component được mount và khi `year` thay đổi
  }, [year]); // Dependency array để trigger lại fetch khi `year` thay đổi

  if (!chartData) return <p>Đang tải...</p>;

  return (
    <section className="container mt-5">
      <h2>Welcome to Admin Panel</h2>
      {/* Biểu đồ doanh thu cho tất cả các khách sạn */}
      <div className="chart-container">
        {/* Dropdown để chọn năm */}
        <select value={year} onChange={(e) => setYear(e.target.value)}>
          {[...Array(10)].map((_, index) => {
            const optionYear = new Date().getFullYear() - index;
            return (
              <option key={optionYear} value={optionYear}>
                {optionYear}
              </option>
            );
          })}
        </select>
        <Line data={chartData} />
      </div>
    </section>
  );
};

export default Admin;
