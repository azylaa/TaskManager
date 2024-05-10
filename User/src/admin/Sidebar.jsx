import React, { useState, useEffect } from 'react';
import axios from "axios";
import { ProSidebar, Menu, MenuItem } from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import { tokens } from "./theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const Item = ({ title, to, icon, selected, setSelected, handleLogout }) => {
  const handleClick = () => {
    setSelected(title); 
    if (handleLogout) {
      handleLogout(); // Check if handleLogout is defined before calling it
    }
  };

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={handleClick} // Ensure to attach the handleClick function here
      icon={icon}
    >
      <Typography style={{color: colors.grey[100],}}>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const APICALL = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/user/${localStorage.getItem('userId')}`, { headers: { "authorization": localStorage.getItem('token') } });
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Handle error here (e.g., show error message)
      }
    };

    if (!localStorage.getItem("token")) {
      navigate("/"); // Use navigate here
    }

    APICALL();
  }, [navigate]); // Add navigate to dependency array

  const handleLogout = () => {
    console.log("Logging out..."); // Add this line
    localStorage.clear()
    navigate("/")
  }

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h3" color={colors.grey[100]}>
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  alt="profile-user"
                  width="100px"
                  height="100px"
                  src={`pic.png`}
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                />
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h2"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  {data.firstName} {data.lastName}
                </Typography>
                <Typography variant="h5" color={colors.grey[300]}>
                 Head
                </Typography>
              </Box>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Item
              title="Dashboard"
              to="/Admin"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Manage Team"
              to="/Admin/Team"
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
             <Item
              title="Log Out"
              handleLogout={handleLogout}
              icon={<ExitToAppIcon />}
              selected={selected}
              setSelected={setSelected} 
            />
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
