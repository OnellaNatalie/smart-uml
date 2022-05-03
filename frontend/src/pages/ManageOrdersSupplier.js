import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import Sidebar from "../components/sidebar/Sidebar";
import TopNav from "../components/topnav/TopNav";
import Table from "../components/table/Table";
import Spinner from "../components/loading/Spinner";
import Error from "../components/toast/Error";
import Badge from "../components/badge/Badge";

import "../assets/css/Usercreate.css";

const ManageOrdersSupplier = () => {
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const [orderDetails, setOrderDetails] = useState([]);
	const fields = [
		"",
		"Item",
		"Quantity",
		"Total Price",
		"Delivery Address",
		"Received At",
		"Status",
		"Actions",
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
			<td style={{ textTransform: "capitalize" }}>{item.DeliveryStatus}</td>
			<td>
				<div className="row-user" style={{ paddingTop: "0" }}>
					{item.DeliveryStatus === "pending" ? (
						<div
							style={{ cursor: "pointer" }}
							onClick={() => {
								if (
									window.confirm(
										"Are you sure to change order status as preparing?"
									)
								) {
									changeDeliveryStatusAsPreparing(item._id);
								}
							}}
						>
							<Badge type="warning" content="Mark as preparing" />
						</div>
					) : item.DeliveryStatus === "preparing" ? (
						<div
							style={{ cursor: "pointer" }}
							onClick={() => {
								if (
									window.confirm(
										"Are you sure to change order status as delivering?"
									)
								) {
									changeDeliveryStatusAsDelivering(item._id);
								}
							}}
						>
							<Badge type="primary" content="Mark as delivering" />
						</div>
					) : item.DeliveryStatus === "delivering" ? (
						<div
							style={{ cursor: "pointer" }}
							onClick={() => {
								if (
									window.confirm(
										"Are you sure to change order status as delivered?"
									)
								) {
									changeDeliveryStatusAsDelivered(item._id);
								}
							}}
						>
							<Badge type="success" content="Mark as delivered" />
						</div>
					) : item.DeliveryStatus === "delivered" ? (
						<div style={{ cursor: "pointer" }}>
							<Link to={`/auth/supplier/deliveryreports/${item._id}`}>
								<Badge type="normal" content="Send Delivery Report" />
							</Link>
						</div>
					) : item.DeliveryStatus === "submitted" ? (
						<div>
							<Badge type="normal" content="Completed" />
						</div>
					) : (
						""
					)}
				</div>
			</td>
		</tr>
	);

	const changeDeliveryStatusAsPreparing = async (id) => {
		try {
			const res = await axios.put(`orders/supplier/prepare/${id}`);
			if (res.statusText === "OK") {
				setIsLoading(true);
				getAllOrders();
				setError("");
				window.alert("Delivery status changed as preparing");
				window.location.reload();
				setIsLoading(false);
			}
		} catch (err) {
			console.log(err.response);
		}
	};

	const changeDeliveryStatusAsDelivering = async (id) => {
		try {
			const res = await axios.put(`orders/supplier/deliver/${id}`);
			if (res.statusText === "OK") {
				getAllOrders();
				setIsLoading(false);
				window.alert("Delivery status changed as delivering");
				window.location.reload();
			}
		} catch (err) {
			console.log(err.response);
		}
	};

	const changeDeliveryStatusAsDelivered = async (id) => {
		try {
			const res = await axios.put(`orders/supplier/delivered/${id}`);
			if (res.statusText === "OK") {
				getAllOrders();
				window.alert("Delivery status changed as delivered");
				setIsLoading(false);
				window.location.reload();
			}
		} catch (err) {
			console.log(err.response);
		}
	};

	const getAllOrders = async () => {
		try {
			const res = await axios.get("orders/supplier");
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
					<h1 className="page-header">Manage Orders</h1>
					<div className="card">
						<h2>Received Orders</h2>
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
			</div>
		</div>
	);
};

export default ManageOrdersSupplier;
