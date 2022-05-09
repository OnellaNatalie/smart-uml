import React, { useState, useEffect } from "react";
import axios from "axios";

import Sidebar from "../components/sidebar/Sidebar";
import Spinner from "../components/loading/Spinner";
import TopNav from "../components/topnav/TopNav";
import Table from "../components/table/Table";
import Badge from "../components/badge/Badge";
import "../components/badge/badge.css";
import "react-calendar/dist/Calendar.css";

const ManageDeliveryReports = () => {
	const [suppliers, setSuppliers] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const fields = [
		"",
		"Item",
		"Quantity",
		"Description",
		"Total",
		"Delivered Address",
		"Order Type",
	];

	const getAllSuppliers = async () => {
		setIsLoading(true);
		try {
			const res = await axios.get(`reports/deliveryreport/supplier`);
			console.log(res);
			setSuppliers(res.data.reports);
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
			<td>{item.item}</td>
			<td>{item.quantity}</td>
			<td>{item.description}</td>
			<td>{item.total}</td>
			<td>{item.address}</td>
			<td>
				{item.urgentOrder ? (
					<div style={{ cursor: "pointer" }}>
						<Badge type="danger" content="Urgent" />
					</div>
				) : (
					<div style={{ cursor: "pointer" }}>
						<Badge type="primary" content="Regular" />
					</div>
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
					<h1 className="page-header">Manage Delivery Reports</h1>
					<div className="row"></div>
					<div className="row">
						<div className="col-12">
							<div className="card">
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
					</div>
				</div>
			</div>
		</div>
	);
};

export default ManageDeliveryReports;
