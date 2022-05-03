import React, { useEffect, useState } from "react";
import axios from "axios";
import { RiDeleteBinLine } from "react-icons/ri";

import "../assets/css/Usercreate.css";

import Sidebar from "../components/sidebar/Sidebar";
import TopNav from "../components/topnav/TopNav";
import Table from "../components/table/Table";
import Spinner from "../components/loading/Spinner";

const ManageUsers = () => {
	const [error, setError] = useState("");
	const [btnState, setBtnState] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [employees, setEmployees] = useState(true);
	const [sites, setSites] = useState([]);
	const [employeeDetails, setEmployeeDetails] = useState({
		name: "",
		email: "",
		username: "",
		position: "",
		phone: "",
		weeklyWorkHrs: "",
		salary: "",
		site: "",
	});
	const fields = [
		"",
		"Employee Name",
		"Email",
		"Username",
		"Weekly Work Hrs",
		"Salary",
		"Actions",
	];

	const renderOrderHead = (item, index) => <th key={index}>{item}</th>;

	const renderOrderBody = (item, index) => (
		<tr key={index}>
			<td>{index + 1}</td>
			<td>{item.name}</td>
			<td>{item.email}</td>
			<td>{item.username}</td>
			<td>{item.weeklyWorkHrs}</td>
			<td>{item.salary}</td>
			<td>
				<>
					<button
						className="action-btn x"
						onClick={() => {
							if (window.confirm("Are you sure to delete this employee?")) {
								deleteHandler(item._id, item.username);
							}
						}}
					>
						<RiDeleteBinLine />
					</button>
				</>
			</td>
		</tr>
	);

	const saveEmployeeDetails = async (e) => {
		e.preventDefault();
		let endpoint;

		e.preventDefault();
		const pattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
		setBtnState(true);

		console.log(employeeDetails);

		for (let key of Object.keys(employeeDetails)) {
			if (!employeeDetails[key]) {
				setBtnState(false);
				return setError("Please fill all the fields");
			}
		}

		if (!employeeDetails.email.match(pattern)) {
			setBtnState(false);
			return setError("Please use valid email address");
		}

		if (employeeDetails.phone.length !== 10) {
			setBtnState(false);
			return setError("Please use valid phone number");
		}

		if (employeeDetails.position === "sitemanager") {
			if (employeeDetails.site === "site") {
				setBtnState(false);
				return setError("Please fill all the fields");
			}
		}

		if (employeeDetails.position === "sitemanager") {
			endpoint = "sitemanagers";
		} else if (employeeDetails.position === "officer") {
			endpoint = "officers";
		}

		try {
			const res = await axios.post(endpoint, employeeDetails);
			setEmployeeDetails({
				name: "",
				email: "",
				username: "",
				site: "",
				phone: "",
				weeklyWorkHrs: "",
				salary: "",
			});
			setError("");
			window.alert("Employee registered successfully");
			setBtnState(false);
			setIsLoading(true);
		} catch (err) {
			setBtnState(false);
			console.log(err.response);
		}
	};

	const deleteHandler = async (id, username) => {
		try {
			let endpoint;

			if (username.includes("@sitemanager")) {
				endpoint = `sitemanagers/${id}`;
			} else {
				endpoint = `officers/${id}`;
			}

			const res = await axios.delete(endpoint);

			if (res.statusText === "OK") {
				getAllEmployees();
				setError("");
				window.alert("Employee has been successfully deleted");
				setIsLoading(true);
			}
		} catch (err) {
			console.log(err.response);
		}
	};

	const getAllEmployees = async () => {
		try {
			const res1 = await axios.get(`users`);
			setEmployees(res1.data.employees);
			const res2 = await axios.get(`sites`);
			setSites(res2.data.sites);
			setIsLoading(false);
		} catch (err) {
			console.log(err.response);
		}
	};

	useEffect(() => getAllEmployees(), []);

	return (
		<div>
			<Sidebar />
			<div id="main" className="layout__content">
				<TopNav />
				<div className="layout__content-main">
					<h1 className="page-header">Manage Users</h1>
					<div className="row">
						<div className="col-12">
							<form className="card" style={{ position: "relative" }}>
								{error && (
									<div className="error-bg" style={{ left: "3%" }}>
										<p>{error}</p>
									</div>
								)}
								<div className="row">
									<div className="col-6">
										<div className="row-user">
											<input
												type="text"
												placeholder="Employee Name"
												value={employeeDetails.name}
												onChange={(e) =>
													setEmployeeDetails({
														...employeeDetails,
														name: e.target.value,
													})
												}
												required
											/>
										</div>
									</div>
									<div className="col-6">
										<div className="row-user">
											<input
												type="email"
												placeholder="Employee Email"
												value={employeeDetails.email}
												onChange={(e) =>
													setEmployeeDetails({
														...employeeDetails,
														email: e.target.value,
													})
												}
												required
											/>
										</div>
									</div>
									<div className="col-6">
										<div className="row-user">
											<input
												type="text"
												placeholder="Mobile Number"
												value={employeeDetails.phone}
												onChange={(e) =>
													setEmployeeDetails({
														...employeeDetails,
														phone: e.target.value,
													})
												}
												required
												maxLength="10"
											/>
										</div>
									</div>
									<div className="col-6">
										<div className="row-user">
											<input
												type="text"
												placeholder="Username"
												value={employeeDetails.username}
												onChange={(e) =>
													setEmployeeDetails({
														...employeeDetails,
														username: e.target.value,
													})
												}
												required
											/>
										</div>
									</div>
									<div className="col-6">
										<div className="row-user">
											<input
												type="text"
												placeholder="Weekly Work Hours"
												value={employeeDetails.weeklyWorkHrs}
												onChange={(e) =>
													setEmployeeDetails({
														...employeeDetails,
														weeklyWorkHrs: e.target.value,
													})
												}
												required
											/>
										</div>
									</div>
									<div className="col-6">
										<div className="row-user">
											<input
												type="text"
												placeholder="Salary"
												value={employeeDetails.salary}
												onChange={(e) =>
													setEmployeeDetails({
														...employeeDetails,
														salary: e.target.value,
													})
												}
												required
											/>
										</div>
									</div>
									<div className="col-6">
										<div className="row-user">
											<select
												name="position"
												id="position"
												value={employeeDetails.position}
												onChange={(e) =>
													setEmployeeDetails({
														...employeeDetails,
														position: e.target.value,
													})
												}
												required
											>
												<option value="position" defaultValue>
													SELECT POSITION
												</option>
												<option value="sitemanager">Site Manager</option>
												<option value="officer">Procurement Officer</option>
											</select>
										</div>
									</div>
									{employeeDetails.position === "sitemanager" ? (
										<div className="col-6">
											<div className="row-user">
												<select
													name="site"
													id="site"
													value={employeeDetails.site}
													onChange={(e) =>
														setEmployeeDetails({
															...employeeDetails,
															site: e.target.value,
														})
													}
													required
												>
													<option value="site" defaultValue>
														SELECT SITE
													</option>
													{sites.length > 0 &&
														sites.map((site) => (
															<option value={site._id}>{site.name}</option>
														))}
												</select>
											</div>
										</div>
									) : (
										""
									)}
								</div>
								<div className="row-user">
									<button type="submit" onClick={saveEmployeeDetails}>
										{btnState ? "Saving" : "Save"}
									</button>
								</div>
							</form>
						</div>
					</div>
					<div className="card">
						<h2>Employee Details</h2>
						{isLoading ? (
							<Spinner />
						) : (
							<Table
								limit="5"
								headData={fields}
								renderHead={(item, index) => renderOrderHead(item, index)}
								bodyData={employees}
								renderBody={(item, index) => renderOrderBody(item, index)}
							/>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ManageUsers;
