import { Box } from "@mui/material";
import Header from "/src/admin/components/Header";
import LineChart from "/src/admin/components/LineChart";

const Line = () => {
  return (
    <Box m="20px">
      <Header title="Line Chart" subtitle="Simple Line Chart" />
      <Box height="75vh">
        <LineChart />
      </Box>
    </Box>
  );
};

export default Line;