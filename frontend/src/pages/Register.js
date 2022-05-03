import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import Error from "../components/toast/Error";
import Success from "../components/toast/Success";

import RegisterImage from "../assets/images/register-img.png";
import LogoImage from "../assets/images/logo.png";

const Login = () => {
	const [btnState, setBtnState] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [user, setUser] = useState({
		username: "",
		password: "",
		name: "",
		email: "",
		phone: "",
	});

	const registerUser = async (e) => {
		e.preventDefault();
		setBtnState(true);
		setError(false);
		setSuccess(false);

		try {
			const res = await axios.post("suppliers", user);

			if (res.statusText === "Created") {
				setUser({
					username: "",
					password: "",
					name: "",
					email: "",
					phone: "",
				});

				setBtnState(false);
				return setSuccess(
					"You are registered. We will let you about the approval. Thank you"
				);
			}
		} catch (err) {
			console.log(err.response);
			setError(err.response.data.message);
			setBtnState(false);
		}
	};

	return (
		<>
			<div className="login-container">
				<img
					src={LogoImage}
					alt="logo-img"
					className="logo"
					data-aos="fade"
					data-aos-delay="100"
				/>
				<h1
					className="page-header login-header accent-header"
					data-aos="zoom-out"
				>
					Supplier Registration
				</h1>
				<div
					className={
						window.innerWidth <= 1400
							? "card login-card col-10"
							: "card login-card col-7"
					}
					data-aos="fade-up"
				>
					<div>
						<div className="row login-form-container">
							<div className="col-6 login-img-container">
								<img
									src={RegisterImage}
									alt="login-img"
									data-aos="fade-right"
								/>
							</div>
							<form className="col-6 login-form">
								{success && (
									<Success
										message={success}
										style={{
											left: success && "0%",
											textAlign: "left",
											position: success && "relative",
											paddingBottom: success && "1.5rem",
										}}
									/>
								)}
								{error && <Error message={error} />}
								<div className="row">
									<div className="col-12">
										<div
											className="row-user"
											data-aos="fade-left"
											data-aos-delay="100"
										>
											<input
												type="text"
												placeholder="Full Name"
												required
												autoComplete="off"
												value={user.name}
												onChange={(e) => {
													setUser({ ...user, name: e.target.value });
												}}
											/>
										</div>
									</div>
									<div className="col-12">
										<div
											className="row-user"
											data-aos="fade-left"
											data-aos-delay="100"
										>
											<input
												type="text"
												placeholder="Username"
												required
												autoComplete="off"
												value={user.username}
												onChange={(e) => {
													setUser({ ...user, username: e.target.value });
												}}
											/>
										</div>
									</div>
									<div className="col-12">
										<div
											className="row-user"
											data-aos="fade-left"
											data-aos-delay="100"
										>
											<input
												type="password"
												placeholder="Password"
												required
												autoComplete="off"
												value={user.password}
												onChange={(e) => {
													setUser({ ...user, password: e.target.value });
												}}
											/>
										</div>
									</div>
									<div className="col-12">
										<div
											className="row-user"
											data-aos="fade-left"
											data-aos-delay="100"
										>
											<input
												type="email"
												placeholder="Email Address"
												required
												autoComplete="off"
												value={user.email}
												onChange={(e) => {
													setUser({ ...user, email: e.target.value });
												}}
											/>
										</div>
									</div>
									<div
										className="col-12"
										data-aos="fade-left"
										data-aos-delay="200"
									>
										<div className="row-user">
											<input
												type="text"
												placeholder="Phone Number"
												autoComplete="off"
												maxLength="10"
												required
												value={user.phone}
												onChange={(e) =>
													setUser({ ...user, phone: e.target.value })
												}
											/>
										</div>
									</div>
								</div>
								<div className="row-user">
									<button
										type="submit"
										className="width-full"
										onClick={registerUser}
										disabled={btnState}
									>
										{btnState ? "SIGNING UP" : "SIGN UP"}
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
				<div className="row-user">
					<Link to="/" style={{ width: "100%", paddingBottom: ".5rem" }}>
						<button
							className="width-full"
							style={{
								background: "transparent",
								fontSize: "2rem",
								color: "#1F2937",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								fontWeight: 600,
							}}
						>
							<i
								className="bx bx-left-arrow-alt"
								style={{
									fontSize: "2rem",
									paddingRight: ".8rem",
								}}
							></i>
							GO BACK
						</button>
					</Link>
				</div>
			</div>
		</>
	);
};

export default Login;
