import React, { useEffect, useState } from "react";
import axios from "axios";
import { GrammarlyEditorPlugin } from "@grammarly/editor-sdk-react";
import { RiDeleteBinLine } from "react-icons/ri";
import { Link } from "react-router-dom";

import Sidebar from "../components/sidebar/Sidebar";
import Spinner from "../components/loading/Spinner";
import Table from "../components/table/Table";
import TopNav from "../components/topnav/TopNav";
import Badge from "../components/badge/Badge";

import "../assets/css/Usercreate.css";

const ManageAssignments = () => {
	const [btnState, setBtnState] = useState(false);
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const [material, setMaterial] = useState({ scenario: "" });
	const [materials, setMaterials] = useState([]);

	const fields = ["", "Module Code", "Name", "Status", "Created At", "Actions"];
	const permissionStatus = {
		pending: "warning",
		approved: "success",
		rejected: "danger",
	};
	const assignments = [
		{ code: "A001", name: "CTSE Assignment", status: "pending", createdAt: "2022-01-01" },
		{ code: "A002", name: "CTSE Assignment", status: "pending", createdAt: "2022-01-01" },
		{ code: "A003", name: "CTSE Assignment", status: "pending", createdAt: "2022-01-01" },
	];

	const renderOrderHead = (item, index) => <th key={index}>{item}</th>;

	const renderOrderBody = (item, index) => (
		<tr key={index}>
			<td>{index + 1}</td>
			<td>{item.code}</td>
			<td>{item.name}</td>
			<td>
				<Badge type={permissionStatus[item.status]} content={item.status} />
			</td>
			<td>{item.createdAt}</td>
			<td>
				<div style={{ display: "flex", alignItems: "center" }}>
					<Link to={`/auth/teacher/assignments/1`}>
						<button className="view-btn">View</button>
					</Link>
					<button className="action-btn check" style={{ marginLeft: "2rem" }}>
						<i className="bx bx-edit-alt"></i>
					</button>
					<button
						className="action-btn x"
						onClick={() => {
							if (window.confirm("Are you sure to delete this material?")) {
								deleteHandler(item._id, item.username);
							}
						}}
					>
						<RiDeleteBinLine />
					</button>
				</div>
			</td>
		</tr>
	);

	const saveMaterial = async e => {
		e.preventDefault();
		setBtnState(true);

		for (let key of Object.keys(material)) {
			if (!material[key]) {
				setBtnState(false);
				return setError("Please fill all the fields");
			}
		}

		try {
			const res = await axios.post("materials", material);
			console.log(res);
			setMaterial({
				scenario: "",
			});
			getAllMaterial();
			setError("");
			window.alert("Assignment added successfully");
			setBtnState(false);
			setIsLoading(true);
		} catch (err) {
			setBtnState(false);
			console.log(err.response);
		}
	};

	const deleteHandler = async (id, username) => {
		try {
			const res = await axios.delete(`materials/${id}`);

			if (res.statusText === "OK") {
				getAllMaterial();
				setError("");
				window.alert("Assignment has been successfully deleted");
				setIsLoading(true);
			}
		} catch (err) {
			console.log(err.response);
		}
	};

	const getAllMaterial = async () => {
		try {
			const res = await axios.get(`materials`);
			setMaterials(res.data.materials);
			setIsLoading(false);
		} catch (err) {
			console.log(err.response);
		}
	};

	useEffect(() => getAllMaterial(), []);

	return (
		<div>
			<Sidebar />
			<div id="main" className="layout__content">
				<TopNav />
				<div className="layout__content-main">
					<h1 className="page-header">Manage Assignments</h1>
					<div className="row">
						<div className="col-12">
							<form className="card" style={{ position: "relative" }}>
								{error && (
									<div className="error-bg" style={{ left: "3%" }}>
										<p>{error}</p>
									</div>
								)}
								<div className="row">
									<div className="col-12">
										<GrammarlyEditorPlugin clientId="5c891c34-55b1-4504-b1a2-5215d35757ba">
											<textarea
												type="text"
												placeholder="PASTE QUESTION SCENARIO HERE..."
												value={material.code}
												onChange={e =>
													setMaterial({
														...material,
														code: e.target.value,
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
											<select name="position" id="position" required>
												<option value="position" defaultValue>
													PLEASE SELECT MODULE
												</option>
												<option value="class">Module A</option>
												<option value="class">Module B</option>
											</select>
										</div>
									</div>

									<div className="col-4">
										<div className="row-user">
											<input
												type="text"
												placeholder="Accepted Plagiarism Percentage"
												value={material.name}
												onChange={e =>
													setMaterial({
														...material,
														name: e.target.value,
													})
												}
												required
											/>
										</div>
									</div>
								</div>
								<div className="row-user">
									<button type="submit" onClick={saveMaterial}>
										{btnState ? "Creating" : "Create"}
									</button>
								</div>
							</form>
						</div>
					</div>
					<div className="card col-12">
						<h2>Created Assignments</h2>
						{false ? (
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
