import NavBar from "./NavBar";
import Profile from "./Profile";

const DashBoard = () =>{
    return (
        <div className="container-login100" style={{ backgroundImage: "url(/bg-01.jpg)", margin:"0",padding:"0" }}>
        <NavBar/>
        <Profile/>
        </div>
    )
}
export default DashBoard;