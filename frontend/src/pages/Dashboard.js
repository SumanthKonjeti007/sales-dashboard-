import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import "../styles/Dashboard.css";
import "../components/MetricCard.css";

const COLORS = ["#FF6384", "#36A2EB", "#FFCE56", "#FF9F40", "#4BC0C0", "#9966FF"];

const Dashboard = () => {
  const [branch, setBranch] = useState("all");
  const [metrics, setMetrics] = useState({});
  const [salesByCity, setSalesByCity] = useState([]);
  const [salesTrend, setSalesTrend] = useState([]);
  const [salesByBranch, setSalesByBranch] = useState([]);
  const [productLineDistribution, setProductLineDistribution] = useState([]);
  const [paymentMethodDistribution, setPaymentMethodDistribution] = useState([]);
  const [revenueDistribution, setRevenueDistribution] = useState([]);
  const [ratingUnitPrice, setRatingUnitPrice] = useState([]);
  const [showMoreVisualizations, setShowMoreVisualizations] = useState(false); // Toggle for additional visualizations

  const handleBranchChange = (e) => {
    setBranch(e.target.value);
  };

  // Fetch data for key metrics
  const fetchMetrics = (selectedBranch) => {
    axios
      .get(`https://fa24-i535-bkonjeti-sales.uc.r.appspot.com/api/metrics?branch=${selectedBranch}`)
      .then((response) => {
        const roundedMetrics = {
          TotalRevenue: Math.round(response.data[0]?.TotalRevenue || 0),
          TotalProductsSold: Math.round(response.data[0]?.TotalProductsSold || 0),
          AverageRating: response.data[0]?.AverageRating
            ? response.data[0].AverageRating.toFixed(1)
            : 0,
          TopSellingProduct: response.data[0]?.TopSellingProduct || "N/A",
        };
        setMetrics(roundedMetrics);
      })
      .catch((error) => console.error("Error fetching metrics:", error));
  };

  // Fetch other data
  const fetchData = (selectedBranch) => {
    axios
      .get(`https://fa24-i535-bkonjeti-sales.uc.r.appspot.com/api/piechart-sales-by-city?branch=${selectedBranch}`)
      .then((res) => setSalesByCity(res.data))
      .catch((error) => console.error("Error fetching sales by city:", error));

    axios
      .get(`https://fa24-i535-bkonjeti-sales.uc.r.appspot.com/api/sales-trend?branch=${selectedBranch}`)
      .then((res) => setSalesTrend(res.data))
      .catch((error) => console.error("Error fetching sales trend:", error));

    axios
      .get(`https://fa24-i535-bkonjeti-sales.uc.r.appspot.com/api/sales-by-branch?branch=${selectedBranch}`)
      .then((res) => setSalesByBranch(res.data))
      .catch((error) => console.error("Error fetching sales by branch:", error));

    axios
      .get(`https://fa24-i535-bkonjeti-sales.uc.r.appspot.com/api/product-line-distribution?branch=${selectedBranch}`)
      .then((res) => setProductLineDistribution(res.data))
      .catch((error) => console.error("Error fetching product line distribution:", error));

    axios
      .get(`https://fa24-i535-bkonjeti-sales.uc.r.appspot.com/api/payment-method-distribution?branch=${selectedBranch}`)
      .then((res) => setPaymentMethodDistribution(res.data))
      .catch((error) => console.error("Error fetching payment method distribution:", error));
  };

  // Fetch revenue distribution
  const fetchRevenueDistribution = () => {
    axios
      .get("https://fa24-i535-bkonjeti-sales.uc.r.appspot.com/api/revenue-distribution-by-product-line")
      .then((res) => setRevenueDistribution(res.data))
      .catch((error) => console.error("Error fetching revenue distribution:", error));
  };

  // Fetch rating vs unit price data
  const fetchRatingUnitPrice = () => {
    axios
      .get("https://fa24-i535-bkonjeti-sales.uc.r.appspot.com/api/lineplot-rating-unitprice")
      .then((res) => setRatingUnitPrice(res.data))
      .catch((error) => console.error("Error fetching rating vs unit price:", error));
  };

  // Load data on branch change and initial render
  useEffect(() => {
    fetchMetrics(branch);
    fetchData(branch);
    fetchRevenueDistribution();
    fetchRatingUnitPrice();
  }, [branch]);

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <h1>Supermarket Sales Dashboard</h1>
        <nav>
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#predictions">Predictions</a></li>
          </ul>
        </nav>
      </header>

      {/* Filters */}
      <div className="filters-container">
        <h3>Filters</h3>
        <select
          value={branch}
          onChange={handleBranchChange}
          className="branch-filter"
        >
          <option value="all">All Branches</option>
          <option value="A">Branch A</option>
          <option value="B">Branch B</option>
          <option value="C">Branch C</option>
        </select>
      </div>

      {/* Metrics */}
      <div className="metrics-container">
        <div className="metric-card">Total Revenue: ${metrics.TotalRevenue}</div>
        <div className="metric-card">Total Products Sold: {metrics.TotalProductsSold}</div>
        <div className="metric-card">Average Rating: {metrics.AverageRating}</div>
        <div className="metric-card">Top-Selling Product: {metrics.TopSellingProduct}</div>
      </div>

      {/* First Section: Filtered Graphs */}
      <div className="charts-container">
        <div className="chart-item half-width">
          <h3>Sales by Branch</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={salesByBranch}
                dataKey="TotalSales"
                nameKey="Branch"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, value }) => `${name}: $${Math.round(value)}`}
              >
                {salesByBranch.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${Math.round(value)}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-item half-width">
          <h3>Payment Method Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={paymentMethodDistribution}>
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="Payment" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="Count" fill="#FFCE56" />
              <Legend />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-item full-width">
          <h3>Sales Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesTrend}>
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="SaleDate" />
              <YAxis tickFormatter={(value) => `$${Math.round(value)}`} />
              <Tooltip formatter={(value) => `$${Math.round(value)}`} />
              <Legend />
              <Line type="monotone" dataKey="TotalSales" stroke="#36A2EB" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="overlay-container">
  <button
    className="overlay-open-button"
    onClick={() => setShowMoreVisualizations(true)}
  >
    View More Visualizations
  </button>

  {showMoreVisualizations && (
    <div className="overlay">
      <div className="overlay-header">
        <h3>Additional Visualizations</h3>
        <button
          className="overlay-close-button"
          onClick={() => setShowMoreVisualizations(false)}
        >
          ✖
        </button>
      </div>

      {/* Conditional Rendering for More Visualizations */}
      <div className="overlay-content">
        <div className="charts-container">
          <div className="chart-item half-width">
            <h3>Sales by City</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={salesByCity}
                  dataKey="TotalSales"
                  nameKey="City"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={60}
                  paddingAngle={5}
                >
                  {salesByCity.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${Math.round(value)}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-item half-width">
            <h3>Product Line Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={productLineDistribution}
                  dataKey="TotalSales"
                  nameKey="ProductLine"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={60}
                  paddingAngle={5}
                >
                  {productLineDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${Math.round(value)}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-item full-width">
            <h3>Revenue Distribution by Product Line</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueDistribution}>
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey="Product line" />
                <YAxis tickFormatter={(value) => `$${Math.round(value)}`} />
                <Tooltip formatter={(value) => `$${Math.round(value)}`} />
                <Bar dataKey="Total" fill="#36A2EB" />
                <Legend />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        </div>
        </div>
        )}
        </div>
    </div>
  );
};

export default Dashboard;
