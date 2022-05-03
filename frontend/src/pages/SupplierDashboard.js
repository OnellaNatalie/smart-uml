import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Calendar from "react-calendar";

import "../components/badge/badge.css";
import "react-calendar/dist/Calendar.css";

import Badge from "../components/badge/Badge";
import Error from "../components/toast/Error";
import Sidebar from "../components/sidebar/Sidebar";
import Spinner from "../components/loading/Spinner";
import Table from "../components/table/Table";
import TopNav from "../components/topnav/TopNav";

import AdminGreeting from "../assets/images/admin-greeting.png";
import ProfilePicture from "../assets/images/admin-user-img.jpg";

import status from "../helpers/greeting";

const SupplierDashboard = () => {
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const [orderDetails, setOrderDetails] = useState([]);
	const [value, onChange] = useState(new Date());

	const fields = [
		"",
		"Item",
		"Quantity",
		"Total Price",
		"Delivery Address",
		"Received At",
		"Status",
	];

	const renderOrderHead = (item, index) => <th key={index}>{item}</th>;

	const renderOrderBody = (item, index) => (
		<tr key={index}>
			<td>{index + 1}</td>
			<td>{item.itemName}</td>
			<td>{item.quantity}</td>
			<td>{item.total}</td>
			<td>{item.address}</td>
			<td>{new Date(item.updatedAt).toDateString()}</td>
			<td>
				<div className="row-user" style={{ paddingTop: "0" }}>
					{item.DeliveryStatus === "pending" ? (
						<Badge type="warning" content={item.DeliveryStatus} />
					) : item.DeliveryStatus === "preparing" ? (
						<Badge type="primary" content={item.DeliveryStatus} />
					) : item.DeliveryStatus === "delivering" ? (
						<Badge type="success" content={item.DeliveryStatus} />
					) : item.DeliveryStatus === "delivered" ? (
						<Badge type="success" content={item.DeliveryStatus} />
					) : item.DeliveryStatus === "submitted" ? (
						<Badge type="normal" content={item.DeliveryStatus} />
					) : (
						""
					)}
				</div>
			</td>
		</tr>
	);

	const getAllOrders = async () => {
		try {
			const res = await axios.get("orders/supplier/my");
			setOrderDetails(res.data.orders);
			setIsLoading(false);
		} catch (err) {
			console.log(err.response);
		}
	};

	useEffect(() => getAllOrders(), []);

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
										<h3>
											Today you have{" "}
											{
												orderDetails.filter(
													(orderDetail) =>
														orderDetail.DeliveryStatus === "pending"
												).length
											}
											{localStorage.setItem(
												"notifications",
												orderDetails.filter(
													(orderDetail) =>
														orderDetail.DeliveryStatus === "pending"
												).length
											)}{" "}
											new orders
										</h3>
										<h3>Also older order statuses to review</h3>
										<Link className="read-more" to="/auth/supplier/orders">
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
									<Link to={`/auth/supplier/orders`}>
										<button className="view-btn">View All</button>
									</Link>
								</div>
								{isLoading ? (
									<Spinner />
								) : orderDetails.length > 0 ? (
									<Table
										limit="5"
										headData={fields}
										renderHead={(item, index) => renderOrderHead(item, index)}
										bodyData={orderDetails}
										renderBody={(item, index) => renderOrderBody(item, index)}
									/>
								) : (
									<>
										{setError("No orders found")}
										<Error message={error} />
									</>
								)}
							</div>
						</div>
						<div className="col-4">
							<div className="card">
								<div className="row">
									<div className="col-4 full-width-1496">
										<img
											src={ProfilePicture}
											alt=""
											className="profile-picture"
										/>
									</div>
									<div className="col-8">
										<h2>{localStorage.getItem("name")}</h2>
										<h3 className="lighter">SUPPLIER</h3>
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

export default SupplierDashboard;
