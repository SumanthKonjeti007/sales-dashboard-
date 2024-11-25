// import React, { useState, useEffect } from "react";
// import { Bar } from "react-chartjs-2";
// import API from "../services/api";

// const Visualizations = () => {
//   const [chartData, setChartData] = useState({});

//   useEffect(() => {
//     API.get("/api/sales-by-branch")
//       .then((res) => {
//         setChartData({
//           labels: res.data.branches,
//           datasets: [
//             {
//               label: "Sales by Branch",
//               data: res.data.totalSales,
//               backgroundColor: "rgba(75,192,192,0.6)",
//             },
//           ],
//         });
//       })
//       .catch((err) => console.error(err));
//   }, []);

//   return (
//     <div>
//       <h1>Visualizations</h1>
//       <Bar data={chartData} />
//     </div>
//   );
// };

// export default Visualizations;
import React from 'react';

const Visualizations = () => {
    return (
        <div>
            <h2>Visualizations</h2>
            <p>View your sales insights here!</p>
        </div>
    );
};

export default Visualizations;
