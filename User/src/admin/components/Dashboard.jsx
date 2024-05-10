import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Typography, useTheme, Popover } from "@mui/material";
import { tokens } from "../theme";
import LineChart from "./LineChart";
import BarChart from "./BarChart";
import StatBox from "./StatBox";
import Header from "./Header";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [barChartData, setBarChartData] = useState([]);
  const [taskDeadlines, setTaskDeadlines] = useState([]);
  const [maleCount, setMaleCount] = useState(0);
  const [femaleCount, setFemaleCount] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [popoverContent, setPopoverContent] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("http://localhost:3000/tasks");
        setBarChartData(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    const fetchMemberCounts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/member-count");
        setMaleCount(response.data.male);
        setFemaleCount(response.data.female);
      } catch (error) {
        console.error("Error fetching member counts:", error);
      }
    };

    const fetchTaskCountsPerMember = async () => {
      try {
        const response = await axios.get("http://localhost:3000/top-members");
        setBarChartData(response.data);
      } catch (error) {
        console.error("Error fetching task counts per member:", error);
      }
    };

    const fetchTaskDeadlines = async () => {
      try {
        const response = await axios.get("http://localhost:3000/task-calendar");
        setTaskDeadlines(response.data);
      } catch (error) {
        console.error("Error fetching task deadlines:", error);
      }
    };

    fetchTasks();
    fetchMemberCounts();
    fetchTaskCountsPerMember();
     fetchTaskDeadlines();
  }, []);

  const totalMembers = maleCount + femaleCount;
  const malePercentage = (maleCount / totalMembers) * 100;
  const femalePercentage = (femaleCount / totalMembers) * 100;

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <Box m="20px">
      {/* HEADER */}
      <Header />

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box 
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          padding="30px"
        >
          <StatBox malePercentage={malePercentage} femalePercentage={femalePercentage} />
        </Box>

        {/* ROW 2 */}
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Box height="20px" width="500px">
            <Typography
              variant="h4"
              fontWeight="600"
              sx={{ color: colors.grey[100] }}
              mt="30px"
              ml="50px"
            >
              Top 5 Members
            </Typography>
            <Typography
              variant="h6"
              fontWeight="10"
              sx={{ color: colors.grey[100] }}
              mt="-7px"
              ml="52px"
            >
              with most highest number of completed tasks
            </Typography>
          </Box>
          <Box
            mt="-10px"
            p="0 30px"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box height="270px" width="100%">
              <BarChart data={barChartData} />
            </Box>
          </Box>
        </Box>

        {/* ROW 3 */}
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Typography
            variant="h4"
            fontWeight="600"
            sx={{ padding: "30px 30px 0 30px" }}
          >
           Tasks History
          </Typography>
          <Box height="250px" ml="50px" mt="-20px">
            {/* Render the LineChart component here */}
            <LineChart />
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          padding="30px"
        >
          {/* Render the calendar */}
          <Box mt="-10px" height="35px" width="250px" position="center">
            <Calendar
              onChange={handleDateChange}
              value={selectedDate}
              tileContent={({ date, view }) => {
                if (view === 'month') {
                  const formattedDate = date.toLocaleDateString();
                  const hasDeadline = taskDeadlines.some(deadline => {
                    const formattedDeadline = new Date(deadline.deadline).toLocaleDateString();
                    return formattedDeadline === formattedDate;
                  });
                  if (hasDeadline) {
                    return <div style={{ backgroundColor: 'red', borderRadius: '50%', width: '3px', height: '3px' }}></div>;
                  }
                }
                return null;
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
