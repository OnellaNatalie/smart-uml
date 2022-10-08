import axios from "axios";
import { Link, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Sidebar from "../components/sidebar/Sidebar";
import TopNav from "../components/topnav/TopNav";
import Table from "../components/table/Table";
import Badge from "../components/badge/Badge";
import Spinner from "../components/loading/Spinner";

const ViewAssignment = () => {
	const { id } = useParams();
	const [Materials, setMaterials] = useState([]);
	const [assignment, setAssignment] = useState({});
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
	const [Loading, setLoading] = useState(false);

	const getAssignment = async () => {
		setLoading(true);
		try {
			const res = await axios.get("/assignments/" + id);
			console.log(res);
			setAssignment(res.data.assignment);
			setLoading(false);
		} catch (err) {
			console.log(err.response);
		}
	};
	useEffect(() => {
		getAssignment();
	}, []);

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
					<Link to={""}>
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
					<h1 className="page-header">{assignment.title}</h1>
					<div className="row">
						<div className="col-12">
							<div className="card">
								<div className="row">
									<div className="col-10">
										<h3>
											Analyze the case study given below and draw a usecase and class diagram.
										</h3>
									</div>
									<div className="col-1">
										<Link to={`/auth/teacher/assignments/${id}/diagrams`}>
											<button className="view-btn">View Generated Diagrams</button>
										</Link>
									</div>
								</div>
								<br />
								<p>{assignment.content}</p>
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
