import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Calendar from "react-calendar";

import "../components/badge/badge.css";
import "react-calendar/dist/Calendar.css";

import Badge from "../components/badge/Badge";
import Error from "../components/toast/Error";
import Sidebar from "../components/sidebar/Sidebar";
import Spinner from "../components/loading/Spinner";
import Table from "../components/table/Table";
import TopNav from "../components/topnav/TopNav";

import AdminGreeting from "../assets/images/admin-greeting.png";
import ProfilePicture from "../assets/images/admin-user-img.jpg";

import status from "../helpers/greeting";

const StudentDashboard = () => {
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const [StudentSubjects, setStudentSubjects] = useState([]);
	const [value, onChange] = useState(new Date());

	const fields = [
		"",
		"ID",
		"Module Code",
		"Module Name",
		"Assignment Type",
		"Title",
		"Start At",
		"End At",
		"Actions",
	];

	const renderOrderHead = (item, index) => <th key={index}>{item}</th>;

	const renderOrderBody = (item, index) => (
		<tr key={index}>
			<td>{index + 1}</td>
			<td>{item.id}</td>
			<td>{item.code}</td>
			<td>{item.name}</td>
			<td>{item.assignment_type}</td>
			<td>{item.title}</td>
			<td>{new Date(item.start_at).toLocaleString()}</td>
			<td>{new Date(item.end_at).toLocaleString()}</td>
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
					<div className="row">
						<div className="col-8 full-width">
							<div className="card greeting-card">
								<div className="row">
									<div className="col-8 flex-column">
										<h1 className="page-header">{`Good ${status}!`}</h1>
										<h3>
											Today you have{" "}
											{
												StudentSubjects.filter(
													(StudentSubject) =>
														StudentSubject.stubjectstatus === "pending"
												).length
											}
											{localStorage.setItem(
												"notifications",
												StudentSubjects.filter(
													(StudentSubject) =>
														StudentSubject.stubjectstatus === "pending"
												).length
											)}{" "}
											Assignments to Complete
										</h3>
										<Link className="read-more" to="/auth/supplier/orders">
											Read more <i className="bx bx-right-arrow-alt"></i>
										</Link>
									</div>
									<div className="col-4">
										<img
											className="admin-greeting"
											src={AdminGreeting}
											alt=""
										/>
									</div>
								</div>
							</div>
						</div>
						<div className="col-4 full-width">
							<div className="card">
								<h2
									className="request-title"
									style={{ color: "transparent", marginBottom: "-.2rem" }}
								>
									Calender
								</h2>
								<Calendar
									className="calender"
									onChange={onChange}
									value={value}
								/>
							</div>
						</div>
					</div>
					<div className="row">
						<div className="col-8">
							<div className="card">
								<div className="flex">
									<h2 className="request-title">Assignments to complete</h2>
								</div>
								{/* {isLoading ? (
									<Spinner />
								) : orderDetails.length > 0 ? ( */}
								<Table
									limit="5"
									headData={fields}
									renderHead={(item, index) => renderOrderHead(item, index)}
									bodyData={StudentSubjects}
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
						<div className="col-4">
							<div className="card">
								<div className="row">
									<div className="col-4 full-width-1496">
										<img
											src={ProfilePicture}
											alt=""
											className="profile-picture"
										/>
									</div>
									<div className="col-8">
										<h2>{localStorage.getItem("name")}</h2>
										<h3 className="lighter">Student</h3>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default StudentDashboard;
