import { useState, useContext } from "react";
import axios from "axios";
import ToastContext from "./context/ToastContext"
import { useNavigate } from "react-router-dom"
import { Person, Envelope, Telephone, Lock } from 'react-bootstrap-icons';


const Register = () => {
	const navigate = useNavigate("")
	const { toast } = useContext(ToastContext)
	const [loading , setLoading] = useState(false)  

	const [data, setData] = useState({
		firstName: "",
		email: "",
		password: "",
		phone: "",
		gender: "",
		role: ""
	})

	const APICALL = async () => {
		try {
			const response = await axios.post('http://localhost:3000/create', {
				firstName: data.firstName,
				phone: data.phone,
				email: data.email,
				gender: data.gender,
				password: data.password,
				role: data.role
			});
			return response.data; // Return the response data
		} catch (error) {
			throw error; // Throw error for error handling in the handleSubmit function
		}
	};	
	const handleChange = (e) => {        
		const newData = { ...data }
		newData[e.target.name] = e.target.value
		setData(newData)
	}

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			await APICALL();
			setLoading(false);
			toast.success("Registered Successfully");
			navigate("/");
		} catch (error) {
			setLoading(false);
			toast.error(error.response.data.message);
		}
	};
	
	return (
		<>
			<div className="limiter">
				<div className="container-login100">
					<div className="wrap-login100">
						<form className="login100-form validate-form">
							<span className="login100-form-logo">
								<img src="logo.png" alt="Logo" />
							</span>

							<span className="login100-form-title p-b-10 p-t-27">
								Register
							</span>

							<div className="wrap-input100 validate-input" data-validate="name">
								<span className="input-group-text" style={{ backgroundColor: 'transparent', color: 'white' }}><Person />
									<input className="input100" type="text" name="firstName" placeholder="Name" value={data.firstName} onChange={(e) => { handleChange(e) }} />
								</span>
							</div>

							<div className="wrap-input100 validate-input" data-validate="Enter username">
								<span className="input-group-text" style={{ backgroundColor: 'transparent', color: 'white' }}><Envelope />
									<input className="input100" type="email" name="email" placeholder="Email" value={data.email} onChange={(e) => { handleChange(e) }} />
								</span>
							</div>
							<div className="wrap-input100 validate-input">
								<span className="input-group-text" style={{ backgroundColor: 'transparent', color: 'white' }}><Telephone />
									<input className="input100" type="tel" name="phone" placeholder="Mobile Number" value={data.phone} onChange={(e) => { handleChange(e) }} />
								</span>
							</div>
							<div className="wrap-input100 validate-input" data-validate="Enter password">
								<span className="input-group-text" style={{ backgroundColor: 'transparent', color: 'white' }}><Lock />
									<input className="input100" type="password" name="password" placeholder="Password" value={data.password} onChange={(e) => { handleChange(e) }} />
								</span>
							</div>

							<div className="wrap-input100 validate-input" data-validate="Select role">
								<span className="input-group-text" style={{ backgroundColor: 'transparent', color: 'white' }}><Person />
									<select
									className="input100"
									name="role"
									value={data.role}
									onChange={handleChange}
									>
									<option style= {{color: 'black'}} value="Head">Head</option>
									<option style= {{color: 'black'}} value="Member">Member</option>
									</select>
								</span>
							</div>
							<div className="wrap-input100 validate-input" data-validate="Gender">
								<span className="input-group-text" style={{ backgroundColor: 'transparent', color: 'white' }}><Person />
									<select
									className="input100"
									name="gender"
									value={data.gender}
									onChange={handleChange}
									>
									<option style= {{color: 'black'}} value="Male">Male</option>
									<option style= {{color: 'black'}} value="Female">Female</option>
									</select>
								</span>
							</div>
							<div className="container-login100-form-btn">
								<button onClick={(e) => { handleSubmit(e) }} className="login100-form-btn">
									Register
								</button>
							</div>

							<div className="text-center p-t-0">
								<span className="txt1" style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
									Login
								</span>
							</div>
						</form>
					</div>
				</div>
			</div>



		</>
	)
}

export default Register