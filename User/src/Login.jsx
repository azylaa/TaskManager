import { useState, useContext } from "react"
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ToastContext from "./context/ToastContext";
import { Envelope, Lock } from 'react-bootstrap-icons';

const Login = () => {
	const [data, setData] = useState({
		email: "",
		password: "",
		role: ""
	})
	const { toast } = useContext(ToastContext)
	const [loading , setLoading] = useState(false)   
	const navigate = useNavigate("")

	const APICALL = async () => {
		await axios.post('http://localhost:3000/login', {
			email: data.email,
			password: data.password,
			role: data.role,
		})
		.then((res) => {
			localStorage.setItem('userId', res.data.userId);
			localStorage.setItem('token', res.data.email);
			localStorage.setItem('role', res.data.role);
			toast.success("Login Successful");

			if (res.data.role === 'Head') {
				navigate("/Admin");
			} else if (res.data.role === 'Member') {
				navigate("/Member");
			} else {
				console.error("Unknown user role:", res.data.role);
				navigate("/home");
			}
		}).catch((e) => {
				// console.log(e.message)
				toast.error(e.response.data.message)
			})
	}
	const handleNavigate = () => {
		navigate("/register")
	}
	const handleChange = (e) => {
		const newdata = { ...data }
		newdata[e.target.name] = e.target.value
		setData(newdata)
	}

	const handleSubmit = (e) => {
		e.preventDefault()
		setLoading(true)
		const call = APICALL()
	}

	return (
		<>
			<div className="limiter">
				<div className="container-login100">
					<div className="wrap-login100-1">
						<form className="login100-form validate-form">
						<span className="login100-form-logo">
							<img src="logo.png" alt="Logo" />
						</span>
							<span className="login100-form-title p-b-34 p-t-27">
								Log in
							</span>

							<div className="wrap-input100 validate-input">
								<span className="input-group-text" style={{ backgroundColor: 'transparent', color: 'white' }}><Envelope />
									<input className="input100" type="email" name="email" placeholder="Email" value={data.email} onChange={(e) => handleChange(e)} />
								</span>
							</div>

							<div className="wrap-input100 validate-input" data-validate="Enter password">
								<span className="input-group-text" style={{ backgroundColor: 'transparent', color: 'white' }}><Lock />
									<input className="input100" type="password" name="password" placeholder="Password" value={data.password} onChange={(e) => handleChange(e)} />
								</span>
							</div>

							<div className="contact100-form-checkbox">
								<input className="input-checkbox100" id="ckb1" type="checkbox" name="remember-me" />
								<label className="label-checkbox100" htmlFor="ckb1">
									Remember me
								</label>
							</div>

							<div className="container-login100-form-btn">
								<button className="login100-form-btn" onClick={(e) => handleSubmit(e)}>
									Login
								</button>
							</div>

							<div className="text-center p-t-30">
								<span className="txt1" style={{ cursor: "pointer" }} onClick={handleNavigate}>
									Register
								</span>
							</div>
						</form>
					</div>
				</div>
			</div>
			<div id="dropDownSelect1"></div>
		</>
	)
}
export default Login
