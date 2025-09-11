import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
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

// Registering chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LineChart = () => {
  const [selectedYear, setSelectedYear] = useState(2025);
  const [chartHeight, setChartHeight] = useState("200px");
  const [isOpen, setIsOpen] = useState(false);

  const years = [2023, 2024, 2025];

  useEffect(() => {
    const updateChartHeight = () => {
      if (window.innerWidth < 768) setChartHeight("150px");
      else if (window.innerWidth < 1024) setChartHeight("200px");
      else setChartHeight("250px");
    };

    updateChartHeight();
    window.addEventListener("resize", updateChartHeight);
    return () => window.removeEventListener("resize", updateChartHeight);
  }, []);

  const allData = {
    2023: {
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      datasets: [
        {
          label: "Total Revenue",
          data: [100, 120, 150, 160, 180, 200, 250, 270, 220, 240, 210, 250],
          fill: false,
          borderColor: "#3fae6a",
          backgroundColor: "transparent",
          tension: 0.4,
          borderWidth: 2,
          pointBorderColor: "#3fae6a",
          pointBackgroundColor: "#3fae6a",
          pointRadius: 4,
        },
      ],
    },
    2024: {
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      datasets: [
        {
          label: "Total Revenue",
          data: [150, 120, 145, 160, 180, 387, 225, 210, 230, 126, 250, 300],
          fill: false,
          borderColor: "#3fae6a",
          backgroundColor: "transparent",
          tension: 0.4,
          borderWidth: 2,
          pointBorderColor: "#3fae6a",
          pointBackgroundColor: "#3fae6a",
          pointRadius: 4,
        },
      ],
    },
    2025: {
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      datasets: [
        {
          label: "Total Revenue",
          data: [200, 180, 210, 250, 300, 400, 350, 320, 310, 290, 330, 400],
          fill: false,
          borderColor: "#198248",
          backgroundColor: "transparent",
          tension: 0.4,
          borderWidth: 2,
          pointBorderColor: "#198248",
          pointBackgroundColor: "#3fae6a",
          pointRadius: 4,
        },
      ],
    },
  };

  const data = allData[selectedYear];

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        backgroundColor: "#3fae6a",
        padding: { x: 20, y: 2 },
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: () => null,
          label: (context) => `$${context.raw.toLocaleString()}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: true, color: "#198248" },
        ticks: {
          color: "#181818",
          maxRotation: 45,
          minRotation: 0,
          autoSkip: true,
          font: { size: window.innerWidth < 768 ? 8 : 12 },
        },
      },
      y: {
        grid: { display: false },
        beginAtZero: false,
        ticks: {
          color: "#181818",
          padding: window.innerWidth < 768 ? 10 : 32,
          callback: (value) => `$${value.toLocaleString()}K`,
          font: { size: window.innerWidth < 768 ? 8 : 12 },
        },
      },
    },
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 sm:mb-4 gap-2 sm:gap-0">
        <h2 className="text-lg sm:text-xl font-bold text-secondary">
          Total Revenue
        </h2>

        {/* Custom dropdown like Statistics select */}
        <div className="relative inline-block w-[150px]">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full font-medium text-[14px] py-[12px] px-[16px] border border-primary text-secondary rounded-lg text-left flex justify-between items-center"
          >
            {selectedYear}
            <span className="ml-2">▼</span>
          </button>

          {isOpen && (
            <ul className="absolute z-10 w-full bg-white border border-primary rounded-lg mt-1 shadow-lg">
              {years.map((year) => (
                <li
                  key={year}
                  onClick={() => {
                    setSelectedYear(year);
                    setIsOpen(false);
                  }}
                  className="cursor-pointer px-4 py-2 text-black hover:bg-primary/10"
                >
                  {year}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div
        style={{ width: "100%", height: chartHeight }}
        className="text-white"
      >
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default LineChart;
