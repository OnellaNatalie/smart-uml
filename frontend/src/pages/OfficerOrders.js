import React, { useState, useEffect } from "react";
import Sidebar from "../components/sidebar/Sidebar";
import TopNav from "../components/topnav/TopNav";
import Table from "../components/table/Table";
import Badge from "../components/badge/Badge";
import axios from "axios";
import Popup from "./Popup";
import { MdDelete } from "react-icons/md";
import {
	FaCheckCircle,
	FaExclamationTriangle,
	FaCheckDouble,
} from "react-icons/fa";

const OfficerOrders = () => {
	const fields = [
		"Order ID",

		"Item Name",
		"Quantity",
		"Total",
		"Created Date",
		"Status",
		"Actions",
	];

	const [orders, setOrders] = useState(null);
	const [trigger, setTrigger] = useState(false);

	const acceptOrder = async (id) => {
		console.log("hi");

		try {
			const res = await axios.put(`orders/officer/${id}`, {
				status: "approved",
			});

			console.log(res);
		} catch (err) {
			console.log(err.response);
		}
		getAllOrder();
	};

	const deleteHandler = async (id) => {
		// console.log("hi");
		try {
			const res = await axios.put(`orders/officer/${id}`, {
				status: "rejected",
			});

			console.log(res);
		} catch (err) {
			console.log(err.response);
		}
		getAllOrder();
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

			<td>
				{item.isApprovedByOfficer == "pending" ? (
					<FaCheckCircle
						className="action-btn check"
						onClick={() => {
							acceptOrder(item._id);
							window.alert("order accepted  successfully");
							window.location.reload();
						}}
					/>
				) : item.isApprovedByOfficer == "approved" ? (
					<FaCheckDouble className="action-btn check " />
				) : (
					""
				)}
				{item.isApprovedByOfficer == "pending" ? (
					<>
						<MdDelete
							className="action-btn x"
							onClick={() => {
								// if (window.confirm("Are you sure to delete this request?")) {
								deleteHandler(item._id);
								setTrigger(true);
								// }
							}}
						/>
						<Popup
							trigger={trigger}
							setTrigger={setTrigger}
							orderId={item._id}
							name="rejectReason"
						/>
					</>
				) : item.isApprovedByOfficer == "rejected" ? (
					<FaExclamationTriangle className="action-btn x" />
				) : (
					""
				)}

				{item.isApprovedByOfficer == "approved" && !item.supplierId ? (
					<>
						<button
							className="action-btn item-assign "
							onClick={() => {
								setTrigger(true);
							}}
						>
							<i className="bx bxs-user-plus"></i>
						</button>
						<Popup
							trigger={trigger}
							setTrigger={setTrigger}
							order={item.itemName}
							orderId={item._id}
							materialId={item.orderItem}
							sitemng={item.siteManagerId}
							total={item.total}
							name="Assign"
						/>
					</>
				) : (
					""
				)}
			</td>
		</tr>
	);
	const getAllOrder = async () => {
		const res = await axios.get("orders/officer/orders");

		// console.log(res.data.orders);
		setOrders(res.data.orders);
	};

	useEffect(() => {
		getAllOrder();
	}, []);

	const permissionStatus = {
		pending: "warning",
		approved: "success",
		rejected: "danger",
	};

	return (
		<div>
			<Sidebar />
			<div id="main" className="layout__content">
				<TopNav />
				<div className="layout__content-main">
					{orders && (
						<Table
							limit="10"
							headData={fields}
							renderHead={(item, index) => renderOrderHead(item, index)}
							bodyData={orders}
							renderBody={(item, index) => renderOrderBody(item, index)}
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export default OfficerOrders;
