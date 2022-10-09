import React, { useEffect, useState } from "react";
import axios from "axios";
import { GrammarlyEditorPlugin } from "@grammarly/editor-sdk-react";
import { RiDeleteBinLine } from "react-icons/ri";
import { Link } from "react-router-dom";

import Sidebar from "../components/sidebar/Sidebar";
import FullScreenLoader from "../components/loading/FullScreenLoader";
import Spinner from "../components/loading/Spinner";
import Table from "../components/table/Table";
import TopNav from "../components/topnav/TopNav";

import "../assets/css/Usercreate.css";

const ManageAssignments = () => {
	const [btnState, setBtnState] = useState(false);
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const [isFullScreenLoading, setIsFullScreenLoading] = useState(false);
	const [assignment, setAssignment] = useState({
		content: "",
		title: "",
		plagiarism_percentage: "",
		assignment_type: "",
		module_id: "",
		start_at: "",
		end_at: "",
	});
	const [assignments, setAssignments] = useState([]);
	const [modules, setModules] = useState([]);

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
			<td>
				<div style={{ display: "flex", alignItems: "center" }}>
					<Link to={`/auth/teacher/assignments/${item.id}`}>
						<button className="view-btn">View</button>
					</Link>
					<button className="action-btn check" style={{ marginLeft: "2rem" }}>
						<i className="bx bx-edit-alt"></i>
					</button>
					<button
						className="action-btn x"
						onClick={() => {
							if (window.confirm("Are you sure to delete this assignment?")) {
								deleteHandler(item.id);
							}
						}}
					>
						<RiDeleteBinLine />
					</button>
				</div>
			</td>
		</tr>
	);

	const saveAssignment = async e => {
		e.preventDefault();
		setIsFullScreenLoading(true);
		setBtnState(true);

		for (let key of Object.keys(assignment)) {
			if (!assignment[key]) {
				setBtnState(false);
				setIsFullScreenLoading(false);
				return setError("Please fill all the fields");
			}
		}

		try {
			const res = await axios.post("assignments/create", assignment);
			console.log(res);
			setAssignment({
				content: "",
				title: "",
				plagiarism_percentage: "",
				module_id: "",
				start_at: "",
				end_at: "",
			});
			getAllAssignments();
			setError("");
			window.alert("Assignment added successfully");
			setBtnState(false);
			setIsFullScreenLoading(false);
			window.location.reload();
		} catch (err) {
			setBtnState(false);
			setIsFullScreenLoading(false);
			setError("Something went wrong");
			console.log(err.response);
		}
	};

	const deleteHandler = async id => {
		try {
			const res = await axios.delete(`assignments/${id}`);

			if (res.statusText === "OK") {
				getAllAssignments();
				setError("");
				window.alert("Assignment has been successfully deleted");
				setIsLoading(true);
			}
		} catch (err) {
			console.log(err.response);
		}
	};

	const getAllModules = async () => {
		setIsLoading(true);
		try {
			const res = await axios.get("modules");
			console.log(res);
			setModules(res.data.modules);
			setIsLoading(false);
		} catch (err) {
			console.log(err.response);
		}
	};

	const getAllAssignments = async () => {
		try {
			const res = await axios.get(`assignments`);
			setAssignments(res.data.assignments);
			setIsLoading(false);
		} catch (err) {
			console.log(err.response);
		}
	};

	useEffect(() => getAllAssignments(), []);
	useEffect(() => getAllModules(), []);

	return (
		<div>
			<Sidebar />
			<div id="main" className="layout__content">
				<TopNav />
				<div className="layout__content-main">
					{isFullScreenLoading && (
						<FullScreenLoader title={"Creating assignment and generating model diagrams..."} />
					)}
					<h1 className="page-header">Manage Assignments</h1>
					<div className="row">
						<div className="col-12">
							<form className="card" style={{ position: "relative" }}>
								{error && (
									<div className="error-bg" style={{ left: "2%", top: "2%" }}>
										<p>{error}</p>
									</div>
								)}
								<div className="row">
									<div className="col-12">
										<div className="row-user">
											<input
												type="text"
												placeholder="Title"
												value={assignment.title}
												onChange={e =>
													setAssignment({
														...assignment,
														title: e.target.value,
													})
												}
												required
											/>
										</div>
									</div>
								</div>
								<div className="row" style={{ marginTop: "1.8rem" }}>
									<div className="col-12">
										<GrammarlyEditorPlugin clientId="5c891c34-55b1-4504-b1a2-5215d35757ba">
											<textarea
												type="text"
												placeholder="PASTE FORMATTED QUESTION SCENARIO HERE..."
												value={assignment.content}
												onChange={e =>
													setAssignment({
														...assignment,
														content: e.target.value,
													})
												}
												required
											/>
										</GrammarlyEditorPlugin>
									</div>
								</div>
								<div className="row">
									<div className="col-4">
										<div className="row-user">
											<select
												name="position"
												id="position"
												required
												onChange={e => {
													setAssignment({
														...assignment,
														module_id: e.target.value,
													});
												}}
											>
												<option value="position" disabled selected>
													PLEASE SELECT MODULE
												</option>
												{modules.map(item => (
													<option
														value={item.id}
														key={item.id}
													>{`${item.code} - ${item.name}`}</option>
												))}
											</select>
										</div>
									</div>
									<div className="col-4">
										<div className="row-user">
											<select
												name="position"
												id="position"
												required
												onChange={e => {
													setAssignment({
														...assignment,
														assignment_type: e.target.value,
													});
												}}
											>
												<option value="position" disabled selected>
													PLEASE SELECT ASSIGNMENT TYPE
												</option>

												<option value="1">Type 1 - Use Case Diagram Only</option>
												<option value="2">Type 2 - Class Diagram Only</option>
												<option value="3">Type 3 - Use Case and Class Diagram Only</option>
											</select>
										</div>
									</div>

									<div className="col-4">
										<div className="row-user">
											<input
												type="text"
												placeholder="Accepted Plagiarism Percentage"
												value={assignment.plagiarism_percentage}
												onChange={e =>
													setAssignment({
														...assignment,
														plagiarism_percentage: e.target.value,
													})
												}
												required
											/>
										</div>
									</div>
									<div className="col-4">
										<div className="row-user">
											<input
												type="datetime-local"
												step={1}
												placeholder="Starts At"
												value={assignment.start_at}
												onChange={e => {
													let date = e.target.value.replace("T", " ");
													setAssignment({
														...assignment,
														start_at: date,
													});
												}}
												required
											/>
										</div>
									</div>
									<div className="col-4">
										<div className="row-user">
											<input
												type="datetime-local"
												step={1}
												placeholder="Ends At"
												value={assignment.end_at}
												onChange={e => {
													let date = e.target.value.replace("T", " ");
													setAssignment({
														...assignment,
														end_at: date,
													});
												}}
												required
											/>
										</div>
									</div>
								</div>
								<div className="row-user">
									<button type="submit" onClick={saveAssignment}>
										{btnState ? "Creating" : "Create"}
									</button>
								</div>
							</form>
						</div>
					</div>
					<div className="card col-12">
						<h2>Created Assignments</h2>
						{isLoading ? (
							<Spinner />
						) : (
							<Table
								limit="5"
								headData={fields}
								renderHead={(item, index) => renderOrderHead(item, index)}
								bodyData={assignments}
								renderBody={(item, index) => renderOrderBody(item, index)}
							/>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ManageAssignments;
