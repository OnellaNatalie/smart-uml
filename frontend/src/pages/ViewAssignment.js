import axios from "axios";
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Sidebar from "../components/sidebar/Sidebar";
import TopNav from "../components/topnav/TopNav";
import Table from "../components/table/Table";
import Badge from "../components/badge/Badge";
import Spinner from "../components/loading/Spinner";
import { RiDeleteBinLine } from "react-icons/ri";
import Popup from "./Popup";

const ViewAssignment = () => {
	const siteId = localStorage.getItem("site");
	const [Materials, setMaterials] = useState([]);
	const students = [
		{
			email: "email@gmail.com",
			submittedAt: "2022-04-05",
			submission: "IT1912192.png",
			plagiarismPercentage: 40,
			CorrectnessPercentage: 70,
		},
		{
			email: "email@gmail.com",
			submittedAt: "2022-04-05",
			submission: "IT1912192.png",
			plagiarismPercentage: 10,
			CorrectnessPercentage: 70,
		},
		{
			email: "email@gmail.com",
			submittedAt: "2022-04-05",
			submission: "IT1912192.png",
			plagiarismPercentage: 30,
			CorrectnessPercentage: 70,
		},
	];
	const fields = [
		"",
		"Student Email",
		"Submission",
		"Plagiarism Percentage",
		"Correctness Percentage",
		"Submitted At",
		"Action",
	];
	const permissionStatus = {
		pending: "warning",
		approved: "success",
		rejected: "danger",
	};
	const [OrderDetail, setOrderDetail] = useState([]);
	const [Loading, setLoading] = useState(false);
	const [Trigger, setTrigger] = useState(false);
	const [Name, setName] = useState("");
	const [Id, setId] = useState("");
	const [ItemName, setItemName] = useState("");
	const [Description, setDescription] = useState("");

	const [Order, setOrder] = useState({
		item: {},
		quantity: 0,
		siteid: siteId,
		requiredDate: "",
		urgentOrder: false,
	});
	console.log(Order);

	const FetchData = async () => {
		const resMaterials = await axios.get(`materials`);
		setMaterials(resMaterials.data.materials);

		const resOrders = await axios.get("/orders");
		setOrderDetail(resOrders.data.orders);

		if (resOrders.statusText === "OK") {
			setLoading(true);
		}
	};

	useEffect(() => {
		FetchData();
	}, []);

	const deleteHandler = async id => {
		console.log(id);
		try {
			const res = await axios.delete(`/orders/delete/${id}`);
			if (res.statusText === "OK") {
				window.location.reload();
			}
		} catch (Err) {
			console.log(Err.response);
		}
	};

	const orderHandler = async () => {
		try {
			console.log(Order);
			const res = await axios.post("/orders", Order);
			if (res.statusText === "OK") {
				window.location.reload();
			}
		} catch (Err) {
			console.log(Err.response);
		}
	};

	const renderOrderHead = (item, index) => <th key={index}>{item}</th>;

	const renderOrderBody = (item, index) => (
		<tr key={index}>
			<td>{index + 1}</td>
			<td>{item.email}</td>
			<td>{item.submission}</td>
			<td>
				{item.plagiarismPercentage >= 20 ? (
					<Badge type={permissionStatus.rejected} content={item.plagiarismPercentage + "%"} />
				) : (
					<Badge type={permissionStatus.approved} content={item.plagiarismPercentage + "%"} />
				)}
			</td>
			<td>{item.CorrectnessPercentage + "%"}</td>
			<td>{item.submittedAt}</td>
			<td>
				<div style={{ display: "flex", alignItems: "center" }}>
					<button className="action-btn check">
						<i
							className="bx bx-check"
							onClick={() => {
								if (window.confirm("Are you sure to accept this submission?")) {
									// successHandler(item._id);
								}
							}}
						></i>
					</button>
					<button
						className="action-btn x"
						style={{ marginRight: "2rem" }}
						onClick={() => {
							if (window.confirm("Are you sure to remove this submission?")) {
								deleteHandler(item._id);
							}
						}}
					>
						<RiDeleteBinLine />
					</button>
					<Link to={``}>
						<button className="view-btn">View</button>
					</Link>
				</div>
			</td>
		</tr>
	);

	return (
		<div>
			<Sidebar />
			<div id="main" className="layout__content">
				<TopNav />
				<div className="layout__content-main">
					<h1 className="page-header">CTSE Assignment 01</h1>
					<div className="row">
						<div className="col-12">
							<div className="card">
								<h3>Analyze the case study given below and draw a usecase diagram.</h3>
								<br />
								<p>
									“GlamourFashions (GF)” is a clothing store situated in Colombo and it’s planning
									to build an online shopping system to promote their sales further. The management
									of clothing store hired you as a System Analyst and asked to come up with the
									design models for GlamourFashions Online Store (GFOS). GlamourFashions (GF) Online
									Clothing Store is expected to organize clothing items under several categories
									like office wear, casual wear, evening wear and so on. A visitor can browse on
									items without being registering to the system. If he/she likes to order item, the
									system facilitates to add selected items into the shopping cart and directly move
									to checkout option. If the user interested to be a regular user, the system will
									provide “registration” facility as well. Without even registering, the user can
									directly go for the “checkout”. For a registered user, the system is expected to
									send a promotion code for users’ mobile every month which can be used only once.
									when the user logs into the system to do online shopping, user can enter this code
									which will give a 5% discount for the order he/she makes. If the user does not use
									the code within the month, automatically the system must “discard promotion code”.
									If it’s been already used, the system must display a message saying “it’s already
									been used”.
								</p>
							</div>
						</div>
					</div>
					<div className="row ">
						<div className="col-12">
							<div className="card">
								<h2>Student Submissions</h2>
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

export default ViewAssignment;
