import { Routes, Route } from "react-router-dom";
import React, { useState } from 'react';
import Sidebar from "./Sidebar";
import Dashboard from "./components/Dashboard";
import Team from "./scenes/Team/index";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import "./admin.css";


function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar isSidebar={isSidebar} />
          <main className="content">
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/Team" element={<Team />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
