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

const SubjectsStudent = () => {
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const [StudentSubjects, setStudentSubjects] = useState([]);
	const fields = [
		"ID",
		"Module Code",
		"Module Name",
		"Assignment Type",
		"Title",
		"",
	];

	const renderOrderHead = (item, index) => <th key={index}>{item}</th>;

	const renderOrderBody = (item, index) => (
		<tr key={index}>
			<td>{item.id}</td>
			<td>{item.code}</td>
			<td>{item.name}</td>
			<td>{item.assignment_type}</td>
			<td>{item.title}</td>
			<td>
				<Link to={`/auth/student/assignment/${item.id}`}>
					<button className="view-btn">View</button>
				</Link>
			</td>
		</tr>
	);

	const getAllSubjects = async () => {
		try {
			const res = await axios.get(`assignments`);
			setStudentSubjects(res.data.assignments);
			setIsLoading(false);
		} catch (err) {
			console.log(err.response);
		}
	};

	useEffect(() => getAllSubjects(), []);

	return (
		<div>
			<Sidebar />
			<div id="main" className="layout__content">
				<TopNav />
				<div className="layout__content-main">
					<h1 className="page-header">All Assignments</h1>
					<div className="card">
						<h2>Assignments you have to complete</h2>
						{/* {isLoading ? (
							<Spinner />
						) : orderDetails.length > 0 ? ( */}
						{StudentSubjects.length !==0?
						<Table
							limit="5"
							headData={fields}
							renderHead={(item, index) => renderOrderHead(item, index)}
							bodyData={StudentSubjects}
							renderBody={(item, index) => renderOrderBody(item, index)}
						/>:''}
						{/* ) : (
							<>
								{setError("No Assignments found")}
								<Error message={error} />
							</>
						)} */}
					</div>
				</div>
			</div>
		</div>
	);
};

export default SubjectsStudent;
