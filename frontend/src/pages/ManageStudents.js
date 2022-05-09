import React, { useState, useContext, useEffect } from "react";
import { RiDeleteBinLine } from "react-icons/ri";
import axios from "axios";

import Sidebar from "../components/sidebar/Sidebar";
import Spinner from "../components/loading/Spinner";
import TopNav from "../components/topnav/TopNav";
import Table from "../components/table/Table";
import Badge from "../components/badge/Badge";
import "../components/badge/badge.css";
import "react-calendar/dist/Calendar.css";

import { AuthContext } from "../contexts/AuthContext";

const ManageStudents = () => {
	const { loggedIn } = useContext(AuthContext);
	const [suppliers, setSuppliers] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const fields = ["", "Username", "Email", "Class", "Registered At", "Actions"];
	const students = [
		{ username: "IT19074343", email: "email@gmail.com", registeredAt: "2022-04-05", class: "A001" },
		{ username: "IT19074343", email: "email@gmail.com", registeredAt: "2022-04-05", class: "A001" },
		{ username: "IT19074343", email: "email@gmail.com", registeredAt: "2022-04-05", class: "A001" },
		{ username: "IT19074343", email: "email@gmail.com", registeredAt: "2022-04-05", class: "A001" },
		{ username: "IT19074343", email: "email@gmail.com", registeredAt: "2022-04-05", class: "A001" },
		{ username: "IT19074343", email: "email@gmail.com", registeredAt: "2022-04-05", class: "A001" },
		{ username: "IT19074343", email: "email@gmail.com", registeredAt: "2022-04-05", class: "A001" },
		{ username: "IT19074343", email: "email@gmail.com", registeredAt: "2022-04-05", class: "A001" },
		{ username: "IT19074343", email: "email@gmail.com", registeredAt: "2022-04-05", class: "A001" },
		{ username: "IT19074343", email: "email@gmail.com", registeredAt: "2022-04-05", class: "A001" },
		{ username: "IT19074343", email: "email@gmail.com", registeredAt: "2022-04-05", class: "A001" },
		{ username: "IT19074343", email: "email@gmail.com", registeredAt: "2022-04-05", class: "A001" },
	];

	const deleteHandler = async id => {
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
			<td>{item.username}</td>
			<td>{item.email}</td>
			<td>{item.class}</td>
			<td>{item.registeredAt}</td>
			<td className="">
				<button
					className="action-btn x"
					onClick={() => {
						if (window.confirm("Are you sure to remove this student?")) {
							deleteHandler(item._id);
						}
					}}
				>
					<RiDeleteBinLine />
				</button>
			</td>
		</tr>
	);

	return (
		<div>
			<Sidebar />
			<div id="main" className="layout__content">
				<TopNav />
				<div className="layout__content-main">
					<h1 className="page-header">Manage Students</h1>
					<div className="row"></div>
					<div className="row">
						<div className="col-12">
							<div className="card">
								{false ? (
									<Spinner />
								) : (
									<Table
										limit="8"
										headData={fields}
										renderHead={(item, index) => renderOrderHead(item, index)}
										bodyData={students}
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

export default ManageStudents;
