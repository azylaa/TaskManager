import { useTheme, Box } from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import { tokens } from "../theme";

const BarChart = ({ data }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Map the data to match the structure expected by the bar chart component
  const formattedData = data.map((item, index) => ({
    user: item.user.split(" ")[0], // Extract the first name from the user field
    totalCompletedTasks: item.totalCompletedTasks,
    rank: index + 1 // Add a rank property based on the index
  }));

  // Define custom colors based on rank
  const rankColors = ['#99FF99', '#DAF7A6', '#FFC300', '#FF5733', '#C70039']; // Example colors

  return (
    <ResponsiveBar
      data={formattedData}
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
      keys={["totalCompletedTasks"]}
      indexBy="user"
      margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
      padding={0.3}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={(bar) => rankColors[bar.index % rankColors.length]} // Use custom colors based on rank
      borderColor={{
        from: "color",
        modifiers: [["darker", "1.6"]],
      }}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legendPosition: "middle",
        legendOffset: 36,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legendPosition: "middle",
        legendOffset: -40,
        legend: "Count",
      }}
      legends={[
        {
          data: rankColors.map((color, index) => ({
            id: `Rank ${index + 1}`,
            label: `Rank ${index + 1}`,
            color: color,
          })),
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 120,
          translateY: 0,
          itemsSpacing: 2,
          itemWidth: 100,
          itemHeight: 20,
          itemDirection: "left-to-right",
          itemOpacity: 0.85,
          symbolSize: 20,
          effects: [
            {
              on: "hover",
              style: {
                itemOpacity: 1,
              },
            },
          ],
          itemTextColor: "#fff" // Set legend text color to white
        },
      ]}
      tooltip={({ id, value, data }) => (
        <Box
          sx={{
            background: "rgba(255, 255, 255, 0.9)",
            padding: "10px",
            borderRadius: "5px",
            color: "#333"
          }}
        >
          <strong>{`${data.user}: ${value} tasks completed`}</strong>
        </Box>
      )}  
    />
  );
};

export default BarChart;
