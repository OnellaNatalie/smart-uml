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
	const [SudentSubjects, setSudentSubjects] = useState([]);
	const fields = ["", "Module Code", "Module Name", "Year", "", "Actions"];
	const subjects = [
		{ ModuleCode: "IT20300", ModuleName: "CTSE", Year: "4th Year" },
		{ ModuleCode: "IT30300", ModuleName: "DMS", Year: "4th Year" },
		{ ModuleCode: "IT40300", ModuleName: "SPM:", Year: "4th Year" },
	];
	const renderOrderHead = (item, index) => <th key={index}>{item}</th>;

	const renderOrderBody = (item, index) => (
		<tr key={index}>
			<td>{}</td>
			<td>{item.ModuleCode}</td>
			<td>{item.ModuleName}</td>
			<td>{item.Year}</td>
			<td>{}</td>
			<td>
				<Link to={`/auth/student/assignment`}>
					<button className="view-btn">View</button>
				</Link>
			</td>
		</tr>
	);

	const getAllSubjects = async () => {
		try {
			const res = await axios.get("/subjects");
			setSudentSubjects(res.data.orders);
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
					<h1 className="page-header">All Modules</h1>
					<div className="card">
						<h2>Subjects You Enrolled </h2>
						{/* {isLoading ? (
							<Spinner />
						) : orderDetails.length > 0 ? ( */}
						<Table
							limit="5"
							headData={fields}
							renderHead={(item, index) => renderOrderHead(item, index)}
							bodyData={subjects}
							renderBody={(item, index) => renderOrderBody(item, index)}
						/>
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
