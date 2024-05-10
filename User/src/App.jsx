import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContextProvider } from "./context/ToastContext";
import Login from "./Login";
import Register from "./Register";
import Admin from "./admin/Admin";
import Team from "/src/admin/scenes/Team";
import Member from "./member/Member";
import Tasks from "./member/Tasks";

const App = () => {
  return (
    <BrowserRouter>
      <ToastContextProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          {/* Nested routes under /Admin/ */}
          <Route path="/Admin/" element={<Admin />}>
            <Route path="Team" element={<Team/>} />
          </Route>
            {/* Nested routes under /Member/ */}
          <Route path="/Member" element={<Member />}>
            <Route path="Tasks" element={<Tasks />} />
          </Route>
        </Routes>
      </ToastContextProvider>
    </BrowserRouter>
  );
};

export default App;
