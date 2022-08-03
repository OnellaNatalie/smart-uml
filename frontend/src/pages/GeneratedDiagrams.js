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

	return (
		<div>
			<Sidebar />
			<div id="main" className="layout__content">
				<TopNav />
				<div className="layout__content-main">
					<div className="row">
						<div className="col-10">
							<h1 className="page-header">CTSE Assignment 01</h1>
						</div>
						<div className="col-1" style={{ marginTop: "1rem" }}>
							<Link to={`/auth/teacher/assignments/1`}>
								<button className="view-btn">Back to Assignment</button>
							</Link>
						</div>
					</div>

					<div className="row">
						<div className="col-12">
							<div className="card">
								<h3>Generated usecase diagram</h3>
								<br />
								<div className="flex" style={{ justifyContent: "center" }}>
									<img
										src="https://d2slcw3kip6qmk.cloudfront.net/marketing/pages/chart/what-is-a-use-case-diagram-in-UML/UML_use_case_example-800x707.PNG"
										alt="usecase"
									/>
								</div>
							</div>
						</div>
					</div>
					<div className="row">
						<div className="col-12">
							<div className="card">
								<h3>Generated class diagram</h3>
								<br />
								<div className="flex" style={{ justifyContent: "center" }}>
									<img
										src="https://www.researchgate.net/profile/Sergi-Valverde/publication/225686440/figure/fig3/AS:667828239732738@1536234068086/A-simple-class-diagram-for-a-commercial-software-application-in-UML-notation-The.png"
										alt="usecase"
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ViewAssignment;
