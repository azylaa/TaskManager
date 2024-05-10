import React, { useEffect, useState } from "react";
import { ResponsiveLine } from "@nivo/line";
import { Select, MenuItem } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../theme";
import axios from "axios";

const LineChart = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [lineChartData, setLineChartData] = useState([]);

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  useEffect(() => {
    const fetchTaskCounts = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`http://localhost:3000/task-count/${selectedYear}`);
        const data = response.data;
  
        // Create an array with data for all 12 months
        const monthsData = Array.from({ length: 12 }, (_, index) => ({
          x: `${index + 1}`, // Month number as string
          y: 0, // Initial count set to 0
        }));

        // Determine the maximum count for pending and completed tasks
        const maxPending = Math.ceil(Math.max(...monthsData.map((d) => d.pending)) / 5) * 5;
        const maxCompleted = Math.ceil(Math.max(...monthsData.map((d) => d.completed)) / 5) * 5;
        const maxY = Math.max(maxPending, maxCompleted);
  
        // Merge the actual task counts into the prepopulated data
        const pendingData = monthsData.map(({ x, y }) => ({
          x,
          y: data.pending[x] || 0, // Use actual count if available, otherwise 0
        }));
        
        const completedData = monthsData.map(({ x, y }) => ({
          x,
          y: data.completed[x] || 0, // Use actual count if available, otherwise 0
        }));
  
        // Set line chart data for both pending and completed tasks
        setLineChartData([
          {
            id: 'Pending',
            data: pendingData,
          },
          {
            id: 'Completed',
            data: completedData,
          },
        ]);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching task counts:", error);
      }
    };
  
    fetchTaskCounts();
  }, [selectedYear]);  

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ height: '200px'}}>
      <Select value={selectedYear} onChange={handleYearChange} style={{ marginBottom: '0px', marginLeft: "450px", height: "50px" }}>
        {/* Assuming years are fetched from backend */}
        <MenuItem value={2022}>2022</MenuItem>
        <MenuItem value={2023}>2023</MenuItem>
        <MenuItem value={2024}>2024</MenuItem>
        <MenuItem value={2025}>2025</MenuItem>
        <MenuItem value={2026}>2026</MenuItem>
        <MenuItem value={2027}>2027</MenuItem>
        <MenuItem value={2028}>2028</MenuItem>
        <MenuItem value={2029}>2029</MenuItem>
        <MenuItem value={2030}>2030</MenuItem>
      </Select>
      <ResponsiveLine
        data={lineChartData}
        theme={{
          axis: {
            domain: {
              line: {
                stroke: colors.grey[100],
              },
            },
            legend: {
              text: {
                fill: colors.grey[100],
              },
            },
            ticks: {
              line: {
                stroke: colors.grey[100],
                strokeWidth: 1,
              },
              text: {
                fill: colors.grey[100],
              },
            },
          },
          legends: {
            text: {
              fill: colors.grey[100],
            },
          },
        }}
        margin={{ top: 5, right: 110, bottom: 50, left: 60 }}
        xScale={{ type: "point" }}
        yScale={{
          type: "linear",
          min: 0,
          max: "auto",
          stacked: false,
          reverse: false,
        }}
        yFormat=" >-.2f"
        curve="monotoneX"
        axisTop={null}
        axisRight={null}
        axisBottom={{
          orient: "bottom",
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Month",
          legendOffset: 36,
          legendPosition: "middle",
          format: value => {
            // Assuming value is the month number (1 for January, 2 for February, etc.)
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            return monthNames[value - 1]; // Subtract 1 to match array index
          }
        }}
        axisLeft={{
          orient: "left",
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Count",
          legendOffset: -40,
          legendPosition: "middle",
        }}
        enableGridX={false}
        enableGridY={false}
        enablePoints={true}
        pointSize={8}
        pointColor={{ theme: 'background' }} 
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }} 
        pointLabelYOffset={-12}
        useMesh={false}
        legends={[
          {
            anchor: "bottom-right",
            direction: "column",
            justify: false,
            translateX: 100,
            translateY: 0,
            itemsSpacing: 0,
            itemDirection: "left-to-right",
            itemWidth: 80,
            itemHeight: 20,
            itemOpacity: 0.75,
            symbolSize: 12,
            symbolShape: "circle",
            symbolBorderColor: "rgba(0, 0, 0, .5)",
            effects: [
              {
                on: "hover",
                style: {
                  itemBackground: "rgba(0, 0, 0, .03)",
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
      />
    </div>
  );
};

export default LineChart;
