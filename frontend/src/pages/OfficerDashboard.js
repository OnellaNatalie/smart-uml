import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Calendar from "react-calendar";

import Sidebar from "../components/sidebar/Sidebar";
import TopNav from "../components/topnav/TopNav";
import Table from "../components/table/Table";

import "react-calendar/dist/Calendar.css";
import "../components/badge/badge.css";

import AdminGreeting from "../assets/images/admin-greeting.png";
import Badge from "../components/badge/Badge";

import profilePicture from "../assets/images/admin-user-img.jpg";
import axios from "axios";
import status from "../helpers/greeting";

const OfficerDashboard = () => {
	const [value, onChange] = useState(new Date());
	const [orders, setOrders] = useState(null);
	const fields = [
		"Order ID",
		"Item Name",
		"Quantity",
		"Total",
		"Created Date",
		"Status",
	];
	const rows = [
		{
			id: "1",
			date: "2021.08.06",
			houseOwner: "Gayath Chandula",
			providence: "Pool",
			status: "Approved",
		},
		{
			id: "2",
			date: "2021.08.06",
			houseOwner: "Gayath Chandula",
			providence: "Pool",
			status: "Pending",
		},
		{
			id: "3",
			date: "2021.08.06",
			houseOwner: "Gayath Chandula",
			providence: "Pool",
			status: "Declined",
		},
		{
			id: "4",
			date: "2021.08.06",
			houseOwner: "Gayath Chandula",
			providence: "Pool",
			status: "Pending",
		},
		{
			id: "4",
			date: "2021.08.06",
			houseOwner: "Gayath Chandula",
			providence: "Pool",
			status: "Pending",
		},
		{
			id: "4",
			date: "2021.08.06",
			houseOwner: "Gayath Chandula",
			providence: "Pool",
			status: "Pending",
		},
	];

	const permissionStatus = {
		pending: "warning",
		Approved: "success",
		Declined: "danger",
	};

	const deleteHandler = (id) => {
		console.log(id);
	};

	const renderOrderHead = (item, index) => <th key={index}>{item}</th>;

	const renderOrderBody = (item, index) => (
		<tr key={index}>
			<td>{index + 1}</td>
			<td>{item.itemName}</td>
			<td>{item.quantity}</td>
			<td>{item.total}</td>

			<td>{new Date(item.createdAt).toLocaleDateString()}</td>
			<td>
				<Badge
					type={permissionStatus[item.isApprovedByOfficer]}
					content={item.isApprovedByOfficer}
				/>
			</td>
			<td className="">
				{item.status === "Pending" && (
					<>
						<button className="action-btn check">
							<i className="bx bx-check"></i>
						</button>
						<button className="action-btn x">
							<i
								className="bx bx-x"
								onClick={() => {
									if (window.confirm("Are you sure to delete this request?")) {
										deleteHandler(item.id);
									}
								}}
							></i>
						</button>
					</>
				)}
			</td>
		</tr>
	);

	const getAllOrder = async () => {
		const res = await axios.get("orders/officer");
		setOrders(res.data.orders);
		console.log(res);
	};

	console.log(orders);

	useEffect(() => {
		getAllOrder();
	}, []);

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
										<h1 className="page-header">{`Good ${status}!`} </h1>
										<h3>
											Today you have{" "}
											{orders &&
												orders.filter(
													(order) => order.isApprovedByOfficer === "pending"
												).length}{" "}
											new notifications
										</h3>
										<h3>Also new booking appointments for approval</h3>
										<Link className="read-more">
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
									<h2 className="request-title">New Orders</h2>
									<Link to={`/auth/officers/orderlist`}>
										<button className="view-btn">View All</button>
									</Link>
								</div>
								{orders ? (
									<Table
										limit="5"
										headData={fields}
										renderHead={(item, index) => renderOrderHead(item, index)}
										bodyData={orders}
										renderBody={(item, index) => renderOrderBody(item, index)}
									/>
								) : (
									<div></div>
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
										<h3 className="lighter">OFFICER</h3>
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

export default OfficerDashboard;
