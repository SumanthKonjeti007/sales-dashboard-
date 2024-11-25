import React from "react";
import "./MetricCard.css";

const MetricCard = ({ title, value }) => {
  return (
    <div className="metric-card">
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  );
};

export default MetricCard;
