import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom"; // Import Link
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ArcElement,
  LineElement,
  PointElement,
} from "chart.js";
import "./Home.css";

// Registering Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ArcElement,
  LineElement,
  PointElement
);

const Home = () => {
  const navigate = useNavigate();
  const [openTickets, setOpenTickets] = useState(0);
  const [closedTickets, setClosedTickets] = useState(0);
  const [operatorName, setOperatorName] = useState("");
  const [chartLabels, setChartLabels] = useState([]); // Add this line

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ticketData, setTicketData] = useState({ open: [], closed: [] });
  const [chartData, setChartData] = useState({ open: [], closed: [] });
  const [tickets, setTickets] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("Open"); // Default to Open
  const defaultCategories = [
    { category: "CCTV", count: 0 },
    { category: "Access Control", count: 0 },
    { category: "Fire Alarm System", count: 0 },
    { category: "PA System", count: 0 },
    { category: "Other", count: 0 },
  ];
  const [categoryCounts, setCategoryCounts] = useState(defaultCategories); 
  const [etaData, setEtaData] = useState([]);

  const fetchTickets = async (status) => {
    const mobileNumber = localStorage.getItem("loggedInUserMobileNumber");
    try {
      const endpoint =
        status === "Open"
          ? `${import.meta.env.VITE_API_URL}/tickets/mobile/${mobileNumber}`
          : `${
              import.meta.env.VITE_API_URL
            }/tickets/mobile/${mobileNumber}/closed`;

      const response = await axios.get(endpoint);
      setTickets(response.data);
    } catch (error) {
      console.error("Failed to fetch tickets:", error);
      setError("Failed to fetch tickets."); // Add error handling
    }
  };
 // Function to fetch category counts
  const fetchCategoryCounts = async () => {
    const mobileNumber = localStorage.getItem("loggedInUserMobileNumber");

    try {
      // Fetch category counts from the API
      const categoryCountResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}/tickets/mobile/${mobileNumber}/category-count`
      );

      console.log("Category Counts Response:", categoryCountResponse.data);

      // Get the category count from the API response
      const fetchedCategoryCounts = categoryCountResponse.data.categoryCount;

      // Create a map for fast lookup based on category name
      const categoryMap = fetchedCategoryCounts.reduce((acc, item) => {
        acc[item.category] = item.count;
        return acc;
      }, {});

      // Create a new array to update counts
      const updatedCategories = defaultCategories.map((category) => {
        return {
          ...category,
          count: categoryMap[category.category] || category.count, // Update count from API or keep default
        };
      });

      // Set the updated category counts
      setCategoryCounts(updatedCategories);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching category counts:", error);
      setError("Failed to fetch category counts.");
      setLoading(false);
    }
  };

  // Fetch category counts when component mounts
  useEffect(() => {
    fetchCategoryCounts();
  }, []);

  const mobileNumbers = localStorage.getItem("loggedInUserMobileNumber");

  const fetchOperatorAndTickets = async () => {
    const mobileNumber = localStorage.getItem("loggedInUserMobileNumber");
    try {
      const operatorResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/operators/name/${mobileNumber}`
      );
      setOperatorName(operatorResponse.data.operatorName || "User");

      const [openResponse, closedResponse, chartCountResponse] =
        await Promise.all([
          axios.get(
            `${import.meta.env.VITE_API_URL}/tickets/mobile/${mobileNumber}`
          ),
          axios.get(
            `${
              import.meta.env.VITE_API_URL
            }/tickets/mobile/${mobileNumber}/closed-count`
          ),
          axios.get(
            `${
              import.meta.env.VITE_API_URL
            }/tickets/mobile/${mobileNumber}/chart-count`
          ),
        ]);

      setOpenTickets(openResponse.data.length);
      setClosedTickets(
        closedResponse.data.closedCount.reduce(
          (acc, item) => acc + item.count,
          0
        )
      );

      // Handle chart data...
    } catch (error) {
      setError("Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };
  const fetchCurrentETA = async (mobileNumber) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/currentETA/${mobileNumber}`
      );
      if (response.data && Array.isArray(response.data.tickets)) {
        const etaData = response.data.tickets.reduce((acc, ticket) => {
          const { days, hours } = ticket.timeDifference;
          acc[ticket.createdDate] = { days, hours };
          return acc;
        }, {});
        setEtaData(etaData);
      } else {
        console.error("Tickets data is not an array or is undefined.");
      }
    } catch (error) {
      console.error("Error fetching ETA data:", error);
    }
  };

  useEffect(() => {
    if (selectedStatus) {
      fetchTickets(selectedStatus);
    }
  }, [selectedStatus]);

  useEffect(() => {
    const mobileNumber = localStorage.getItem("loggedInUserMobileNumber");

    if (mobileNumber) {
      const fetchTicketsAndOperator = async () => {
        try {
          // Fetch operator information
          const operatorResponse = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/operators/name/${mobileNumber}`
          );
          setOperatorName(operatorResponse.data.operatorName || "User");

          // Fetch open tickets
          const openResponse = await axios.get(
            `${import.meta.env.VITE_API_URL}/tickets/mobile/${mobileNumber}`
          );
          setOpenTickets(openResponse.data.length);

          // Fetch closed tickets
          const closedResponse = await axios.get(
            `${
              import.meta.env.VITE_API_URL
            }/tickets/mobile/${mobileNumber}/closed-count`
          );
          console.log("Closed Tickets Response:", closedResponse.data);
          setClosedTickets(
            closedResponse.data.closedCount.reduce(
              (acc, item) => acc + item.count,
              0
            )
          );

          // Fetch chart count data
          const chartCountResponse = await axios.get(
            `${
              import.meta.env.VITE_API_URL
            }/tickets/mobile/${mobileNumber}/chart-count`
          );
          console.log("Chart Count Response:", chartCountResponse.data);

          // Process chart data
          const chartCounts = chartCountResponse.data.chartCount;
          const openCounts = [];
          const closedCounts = [];
          const monthLabels = [];

          chartCounts.forEach((count) => {
            openCounts.push(count.openCount);
            closedCounts.push(count.closedCount);
            monthLabels.push(count.month);
          });

          setChartData({ open: openCounts, closed: closedCounts });
          setChartLabels(monthLabels);

          // Fetch category counts
          // const categoryCountResponse = await axios.get(
          //   `${
          //     import.meta.env.VITE_API_URL
          //   }/tickets/mobile/${mobileNumber}/category-count`
          // );
          // console.log("Category Counts Response:", categoryCountResponse.data);
          // setCategoryCounts(categoryCountResponse.data.categoryCount);

          // Fetch current ETA for open tickets
          const etaResponse = await axios.get(
            `${import.meta.env.VITE_API_URL}/currentETA/${mobileNumber}`
          );
          console.log("Current ETA Response:", etaResponse.data);
          setEtaData(etaResponse.data.tickets); // Assuming this returns the relevant tickets data

          setLoading(false);
        } catch (error) {
          setError("Failed to fetch data.");
          setLoading(false);
        }
      };

      fetchTicketsAndOperator();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchPastMonthsData = async (mobileNumber) => {
    // Example static data; replace this with your API call if needed
    return {
      open: [5, 3, 4, 2, 7, 1],
      closed: [3, 2, 4, 1, 3, 0],
    };
  };

  const handleCreateTicketClick = () => {
    navigate("/dashboard/create-ticket");
  };

  const handleCategoryButtonClick = () => {
    alert("Category button clicked!");
  };

  // Data for the chart
  const chartDataToShow = {
    labels: chartLabels,
    datasets: [
      {
        label: "Open Tickets",
        data: chartData.open,
        backgroundColor: "rgba(90, 106, 207, 1)",
      },
      {
        label: "Closed Tickets",
        data: chartData.closed,
        backgroundColor: "rgba(230, 232, 236, 1)",
      },
    ],
  };

  // Data for the pie chart
  const pieChartData = {
    labels: categoryCounts.map((category) => category.category),
    datasets: [
      {
        data: categoryCounts.map((category) => category.count),
        backgroundColor: [
          "rgba(90, 106, 207, 1)",
          "rgba(133, 147, 237, 1)",
          "rgba(222, 225, 244, 1)",
        ],
      },
    ],
  };

  const total = categoryCounts.reduce(
    (acc, category) => acc + category.count,
    0
  );

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%",
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const category = categoryCounts[tooltipItem.dataIndex];
            const percentage = ((category.count / total) * 100).toFixed(2);
            return `${category.category}: ${category.count} (${percentage}%)`;
          },
        },
      },
      // Custom plugin to draw percentages
      beforeDraw: (chart) => {
        const ctx = chart.ctx;
        const data = chart.data.datasets[0].data;
        const total = data.reduce((acc, val) => acc + val, 0);
        const centerX = chart.getDatasetMeta(0).data[0]._model.x;
        const centerY = chart.getDatasetMeta(0).data[0]._model.y;

        data.forEach((value, index) => {
          const percentage = ((value / total) * 100).toFixed(2);
          ctx.fillStyle = "white";
          ctx.font = "bold 12px Arial";
          ctx.textAlign = "center";
          ctx.fillText(`${percentage}%`, centerX, centerY); // Adjust x and y as needed
        });
      },
    },
  };

  const categoryShares = pieChartData.labels.map((label, index) => ({
    label,
    percentage: ((pieChartData.datasets[0].data[index] / total) * 100).toFixed(
      2
    ),
    color: pieChartData.datasets[0].backgroundColor[index],
  }));
  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%",
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const category = categoryCounts[tooltipItem.dataIndex];
            const percentage = ((category.count / total) * 100).toFixed(2);
            return `${category.category}: ${category.count} (${percentage}%)`;
          },
        },
      },
    },
  };
  // Data for the line chart
  const lineChartData = {
    labels: ["Sep-24", "Oct-24", "Nov-24", "Dec-24", "Jan-25", "Feb-25"],
    datasets: [
      {
        label: "Tickets Over Time",
        data: [10, 15, 8, 12, 20, 25], // Sample data
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        fill: true,
      },
    ],
  };
  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false);
  const [selectedTicketForFeedback, setSelectedTicketForFeedback] = useState(null);
  return (
    <div className="p-8 bg-white min-h-screen flex flex-col">
      {/* Welcome Message */}
      <div className="mb-1 ml-0 pl-20 mt-10">
        <h1 className="text-4xl inline-block font-poppins">
          Hello {operatorName} 👋
        </h1>
        <p className="mt-2 text-lg font-poppins">
          Generate Service Tickets, periodic Auditable Performance Reports and
          get instant updates on your <br />
          opened tickets with Deskassure by Foxnet.
        </p>
      </div>

      {/* Left and Right Sections */}
      <div className="flex w-full">
        {/* Left Section */}
        <div className="flex flex-col w-3/5 mr-1">
          {/* Upper Left with Chart */}
          <div className="bg-white flex-1 m-0 p-4 h-[30%] ml-16 mb-0">
            <div className="mt-4 flex justify-between">
              <h3 className="text-lg font-medium text-gray-700 mb-4 font-poppins">
                <strong>Open vs Close Ticket</strong>
              </h3>
              <button className="w-36 bg-custom-gradient text-white font-poppins font-light py-3 rounded-xl shadow-md text-sm">
                View Report
              </button>
            </div>
            <div className="h-[80%] mt-[19px]">
              {" "}
              {/* Add a specific height here */}
              <Bar
                data={chartDataToShow}
                options={{ responsive: true, maintainAspectRatio: false }}
                // height={100} // This can be kept or removed
              />
            </div>
          </div>

          {/* Horizontal Line for Upper and Lower Separation */}
          <div className="border-t border-[#C8CBD9] my-0 mt-0 mb-0" />

          {/* Lower Left Section */}
          <div className="bg-[#fff] flex-1 m-0  p-0 ml-14 h-[50%]">
            <div className="flex w-full h-full items-stretch">
              {/* Left Side of Lower Left Section */}
              <div className="flex-1 p-4 pt-9 ">
                <h3 className="text-lg font-medium text-gray-700 mb-4 font-poppins text-left">
                  <strong>Miscellaneous</strong>
                </h3>
                <div className="flex flex-col gap-2  w-full">
                  <div className="flex-1 p-4 rounded w-full bg-[#f6e69b] pl-3 pt-3 pb-3 flex items-center">
                    <div className="bg-white w-16 h-12 rounded-xl flex items-center pl-[4.5%]">
                      <img src="/ppm_2.png" alt="" className="w-10 h-10" />
                    </div>
                    <div className="ml-3">
                      {" "}
                      {/* Add margin-left for spacing */}
                      <span className="font-poppins text-sm">
                        <b>Support Inventory</b>
                      </span>
                      <br />
                      <span className="text-lg font-poppins">Maintained</span>
                    </div>
                  </div>

                  <div className="flex-1 p-4 rounded w-full bg-[#c3a3cc] pl-3 pt-3 pb-3 flex items-center">
                    <div className="bg-white w-16 h-12 rounded-xl flex items-center pl-[4.5%]">
                      <img src="/ppm_3.png" alt="" className="w-10 h-10" />
                    </div>
                    <div className="ml-3">
                      {" "}
                      {/* Add margin-left for spacing */}
                      <span className="font-poppins text-sm">
                        <b>Healthcheck</b>
                      </span>{" "}
                      <br /> <span className="text-lg font-poppins">Ontime</span>
                    </div>
                  </div>

                  <div className="flex-1 p-4 rounded w-full bg-[#e49dbd] pl-3 pt-3 pb-3 flex items-center">
                    <div className="bg-white w-16 h-12 rounded-xl flex items-center pl-[4.5%]">
                      <img src="/ppm_4.png" alt="" className="w-10 h-10" />
                    </div>
                    <div className="ml-3">
                      {" "}
                      {/* Add margin-left for spacing */}
                      <span className="font-poppins text-sm">
                        <b>Preventive maintenance</b>
                      </span>{" "}
                      <br /> <span className="text-lg font-poppins">Ontime</span>
                    </div>
                  </div>

                  <div className="flex-1 p-4 rounded w-full bg-[#6dcbef] pl-3 pt-3 pb-3 flex items-center">
                    <div className="bg-white w-16 h-12 rounded-xl flex items-center pl-[4.5%]">
                      <img src="/ppm_5.png" alt="" className="w-10 h-10" />
                    </div>
                    <div className="ml-3">
                      {" "}
                      {/* Add margin-left for spacing */}
                      <span className="font-poppins text-sm">
                        <b>CSAT Survey</b>
                        <br />
                      </span>
                      <span className="text-lg font-poppins">3.5/5</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Horizontal Ruler */}
              <div className="w-px bg-[#C8CBD9] mx-0 " />

              {/* Lower Left Content - Right */}

              <div className="flex-1 p-4 pt-9">
                <h3 className="text-lg font-medium text-gray-700 mb-4 font-poppins text-left">
                  <strong className="font-poppins">Tickets List</strong>
                </h3>

                <div className="mb-4 flex flex-row gap-10 mt-6">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="Open"
                      checked={selectedStatus === "Open"}
                      onChange={() => setSelectedStatus("Open")}
                      className={`mr-2 ${
                        selectedStatus === "Open" ? "bg-green-500" : ""
                      }`}
                      style={{
                        accentColor: selectedStatus === "Open" ? "green" : "",
                      }}
                    />
                    <span className="text-[14px] font-poppins">
                      Open Tickets
                    </span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="Closed"
                      checked={selectedStatus === "Closed"}
                      onChange={() => setSelectedStatus("Closed")}
                      className={`mr-2 ${
                        selectedStatus === "Closed" ? "bg-red-500" : ""
                      }`}
                      style={{
                        accentColor: selectedStatus === "Closed" ? "red" : "",
                      }}
                    />
                    <span className="text-[14px] font-poppins">
                      Closed Tickets
                    </span>
                  </label>
                </div>

               <div className="ticket-list-container h-[75%]">
  <ul className="ticket-list font-poppins">
    {tickets.length > 0 ? (
      tickets.map((ticket) => {
        const ticketETA = etaData.find(
          (eta) => eta.createdDate === ticket.date
        );
        const timeRemaining = ticketETA
          ? `${ticketETA.timeDifference.hours}h ${ticketETA.timeDifference.minutes}m`
          : "N/A";

        return (
          <Link
            to={
              selectedStatus === "Open"
                ? "/dashboard/open"
                : "/dashboard/close"
            }
            key={ticket.ticketNo}
            className="ticket-list-item"
          >
            <li className="flex items-center mb-3 cursor-pointer">
              <div
                className={`h-10 w-10 rounded-full flex justify-center items-center text-yellow-500 text-l font-poppins mr-4 ${
                  selectedStatus === "Closed"
                    ? "bg-red-200"
                    : "bg-green-200"
                }`}
              >
                {ticketETA ? timeRemaining : ""}
              </div>
              <span>{ticket.ticketNo}</span>
            </li>
          </Link>
        );
      })
    ) : (
      <p className="font-poppins">No tickets found.</p>
    )}

    {/* Duplicate the list for seamless scrolling */}
    {tickets.length > 0 && (
      tickets.map((ticket) => {
        const ticketETA = etaData.find(
          (eta) => eta.createdDate === ticket.date
        );
        const timeRemaining = ticketETA
          ? `${ticketETA.timeDifference.hours}h ${ticketETA.timeDifference.minutes}m`
          : "N/A";

        return (
          <Link
            to={
              selectedStatus === "Open"
                ? "/dashboard/open"
                : "/dashboard/close"
            }
            key={`duplicate-${ticket.ticketNo}`}
            className="ticket-list-item"
          >
            <li className="flex items-center mb-3 cursor-pointer">
              <div
                className={`h-10 w-10 rounded-full flex justify-center items-center text-yellow-500 text-l font-poppins mr-4 ${
                  selectedStatus === "Closed"
                    ? "bg-red-200"
                    : "bg-green-200"
                }`}
              >
                {ticketETA ? timeRemaining : ""}
              </div>
              <span className="font-poppins">{ticket.ticketNo}</span>
            </li>
          </Link>
        );
      })
    )}
  </ul>
</div>

              </div>
            </div>
          </div>
        </div>

        {/* Vertical Divider */}
        <div className="w-[1px] bg-[#C8CBD9]" />

        {/* Right Section */}
        <div className="flex flex-col w-2/5 m-0 ml-1">
          {/* Upper Right with Pie Chart */}
      <div className="bg-white flex-1 p-4 h-[30%] -mb-4">
  {/* Header with Title and Button */}
  <div className="mt-4 mb-2 flex justify-between">
    <h3 className="text-lg font-medium text-gray-700 mb-4 font-poppins">
      <strong>Category Distribution</strong>
    </h3>
    <button
      className="w-36 bg-custom-gradient text-white font-poppins font-light py-3 rounded-xl shadow-md text-sm"
    >
      View Report
    </button>
  </div>

  {/* Centered Pie Chart */}
  <div className="flex justify-center">
    <div className="w-[40%] h-56 mt-4 ml-12">
      <Pie data={pieChartData} options={options} />
    </div>
  </div>

  {/* Category Counts with Responsive Wrapping and Scaling */}
  <div className="mt-4 ml-40">
    <ul
      className={`font-poppins flex flex-wrap gap-4 text-center ${
        categoryCounts.length > 5 ? "text-xs gap-2" : "text-base"
      }`}
    >
      {categoryCounts.map((category) => (
        <li
          key={category.category}
          className={`${
            categoryCounts.length > 5 ? "w-[45%] md:w-[30%]" : "w-[30%] md:w-auto"
          }`}
        >
          <div className="mb-2">
            {category.category}
          </div>
          <div>
            <span className={`${categoryCounts.length > 5 ? "text-sm" : "text-xl"}`}>
              {category.count}
            </span>
          </div>
        </li>
      ))}
    </ul>
  </div>
</div>



          {/* Horizontal Line for Upper and Lower Separation */}
          <div className="border-t bg-[#C8CBD9] my-0 " />

          {/* Lower Right with Line Chart */}
          <div className="bg-white flex-1 pt-4 pl-4 pr-4 h-[50%]">
            {/* Add the button here */}
            <div className="mt-4 flex justify-between pt-0">
              <div className=" mb-6">
                <h3 className="text-lg font-medium text-gray-700 mb-4 font-poppins text-left ">
                  <strong>Ticket Trends Over Time</strong>
                </h3>
              </div>
              <div>
                <button
                  className="w-36 bg-custom-gradient text-white font-poppins font-light py-3 rounded-xl shadow-md text-sm mb-2 " // Changed to font-bold
                >
                  View Report
                </button>
              </div>
            </div>
            <div className="h-[250px]">
              <Line
                data={lineChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
