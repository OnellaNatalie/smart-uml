import React, { useState, useContext, useEffect } from "react";
import axios from "axios";

import Sidebar from "../components/sidebar/Sidebar";
import Spinner from "../components/loading/Spinner";
import TopNav from "../components/topnav/TopNav";
import Table from "../components/table/Table";
import Badge from "../components/badge/Badge";
import "../components/badge/badge.css";
import "react-calendar/dist/Calendar.css";

import { AuthContext } from "../contexts/AuthContext";

const ManageSuppliers = () => {
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
			<td className="">
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
					<h1 className="page-header">Manage Suppliers</h1>
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

export default ManageSuppliers;
