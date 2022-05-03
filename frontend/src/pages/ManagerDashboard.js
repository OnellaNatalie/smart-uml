import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import Sidebar from "../components/sidebar/Sidebar";
import Spinner from "../components/loading/Spinner";
import TopNav from "../components/topnav/TopNav";
import Table from "../components/table/Table";
import AdminGreeting from "../assets/images/admin-greeting.png";
import Badge from "../components/badge/Badge";
import "../components/badge/badge.css";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import profilePicture from "../assets/images/admin-user-img.jpg";

import status from "../helpers/greeting";

import { AuthContext } from "../contexts/AuthContext";

const AdminDashboard = () => {
	const [value, onChange] = useState(new Date());
	const { loggedIn } = useContext(AuthContext);
	const [suppliers, setSuppliers] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const fields = ["", "Name", "Email", "Username", "Status", "Actions"];

	const permissionStatus = {
		pending: "warning",
		approved: "success",
		rejected: "danger",
	};

	const deleteHandler = async (id) => {
		try {
			const res = await axios.patch(`/suppliers/reject/${id}`);
			if (res.statusText === "OK") {
				getAllSuppliers();
				window.alert("Supplier request has been successfully rejected");
			}
		} catch (err) {
			console.log(err.response);
		}
	};

	const successHandler = async (id) => {
		try {
			const res = await axios.patch(`/suppliers/approve/${id}`);
			console.log(res);
			if (res.statusText === "OK") {
				getAllSuppliers();
				window.alert("Supplier request has been successfully approved");
			}
		} catch (err) {
			console.log(err);
		}
	};

	const getAllSuppliers = async () => {
		setIsLoading(true);
		try {
			const res = await axios.get(`suppliers`);
			setSuppliers(res.data.suppliers);
			setIsLoading(false);
		} catch (err) {
			console.log(err.response);
		}
	};

	useEffect(() => getAllSuppliers(), []);

	const renderOrderHead = (item, index) => <th key={index}>{item}</th>;

	const renderOrderBody = (item, index) => (
		<tr key={index}>
			<td>{index + 1}</td>
			<td>{item.name}</td>
			<td>{item.email}</td>
			<td>{item.username}</td>
			<td>
				<Badge type={permissionStatus[item.status]} content={item.status} />
			</td>
			<td>
				{item.status === "pending" && (
					<>
						<button className="action-btn check">
							<i
								className="bx bx-check"
								onClick={() => {
									if (window.confirm("Are you sure to approve this request?")) {
										successHandler(item._id);
									}
								}}
							></i>
						</button>
						<button className="action-btn x">
							<i
								className="bx bx-x"
								onClick={() => {
									if (window.confirm("Are you sure to reject this request?")) {
										deleteHandler(item._id);
									}
								}}
							></i>
						</button>
					</>
				)}
			</td>
		</tr>
	);

	return (
		<div>
			<Sidebar />
			<div id="main" className="layout__content">
				<TopNav />
				<div className="layout__content-main">
					<div className="row">
						<div className="col-8 full-width">
							<div className="card greeting-card">
								<div className="row">
									<div className="col-8 flex-column">
										<h1 className="page-header">{`Good ${status}!`}</h1>
										<h3>Today you have 9 new notifications</h3>
										<h3>Also new booking appointments for approval</h3>
										<Link className="read-more" to={`/auth/manager/suppliers`}>
											Read more <i className="bx bx-right-arrow-alt"></i>
										</Link>
									</div>
									<div className="col-4">
										<img
											className="admin-greeting"
											src={AdminGreeting}
											alt=""
										/>
									</div>
								</div>
							</div>
						</div>
						<div className="col-4 full-width">
							<div className="card">
								<h2
									className="request-title"
									style={{ color: "transparent", marginBottom: "-.2rem" }}
								>
									Calender
								</h2>
								<Calendar
									className="calender"
									onChange={onChange}
									value={value}
								/>
							</div>
						</div>
					</div>
					<div className="row">
						<div className="col-8">
							<div className="card">
								<div className="flex">
									<h2 className="request-title">Registered Suppliers</h2>
									<Link to={`/auth/manager/suppliers`}>
										<button className="view-btn">View All</button>
									</Link>
								</div>
								{isLoading ? (
									<Spinner />
								) : (
									<Table
										limit="5"
										headData={fields}
										renderHead={(item, index) => renderOrderHead(item, index)}
										bodyData={suppliers}
										renderBody={(item, index) => renderOrderBody(item, index)}
									/>
								)}
							</div>
						</div>
						<div className="col-4">
							<div className="card">
								<div className="row">
									<div className="col-4 full-width-1496">
										<img
											src={profilePicture}
											alt=""
											className="profile-picture"
										/>
									</div>
									<div className="col-8">
										<h2>{localStorage.getItem("name")}</h2>
										<h3 className="lighter">MANAGER</h3>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AdminDashboard;
