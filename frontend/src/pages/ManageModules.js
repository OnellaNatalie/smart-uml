import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { RiDeleteBinLine } from "react-icons/ri";
import axios from "axios";

import Sidebar from "../components/sidebar/Sidebar";
import Spinner from "../components/loading/Spinner";
import Table from "../components/table/Table";
import TopNav from "../components/topnav/TopNav";

import "../assets/css/Usercreate.css";

const ManageModules = () => {
	const [btnState, setBtnState] = useState(false);
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const [module, setModule] = useState({ code: "", name: "" });
	const [modules, setModules] = useState([]);

	const fields = ["", "Module Code", "Module Name", "Created At", "Actions"];

	const renderOrderHead = (item, index) => <th key={index}>{item}</th>;
	const renderOrderBody = (item, index) => (
		<tr key={index}>
			<td>{index + 1}</td>
			<td>{item.code}</td>
			<td>{item.name}</td>
			<td>{item.createdAt}</td>
			<td>
				<div style={{ display: "flex", alignItems: "center" }}>
					<Link to={``}>
						<button className="view-btn">View Module</button>
					</Link>
					<button
						className="action-btn x"
						style={{ marginLeft: "2rem" }}
						onClick={() => {
							if (window.confirm("Are you sure to delete this module?")) {
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

		for (let key of Object.keys(module)) {
			if (!module[key]) {
				setBtnState(false);
				return setError("Please fill all the fields");
			}
		}

		try {
			const res = await axios.post("/modules/create", module);
			console.log(res);
			setModule({ code: "", name: "" });
			getAllModules();
			setError("");
			window.alert("Module added successfully");
			setBtnState(false);
			setIsLoading(true);
		} catch (err) {
			setBtnState(false);
			setError(err.response.data.message);
			console.log(err.response);
		}
	};

	const deleteHandler = async (id, username) => {
		try {
			const res = await axios.delete(`modules/${id}`);

			if (res.statusText === "OK") {
				getAllModules();
				setError("");
				window.alert("Class has been successfully deleted");
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

	useEffect(() => getAllModules(), []);

	return (
		<div>
			<Sidebar />
			<div id="main" className="layout__content">
				<TopNav />
				<div className="layout__content-main">
					<h1 className="page-header">Manage Modules</h1>
					<div className="row">
						<div className="col-12">
							<form className="card" style={{ position: "relative" }}>
								{error && (
									<div className="error-bg" style={{ left: "3%" }}>
										<p>{error}</p>
									</div>
								)}
								<div className="row">
									<div className="col-6">
										<div className="row-user">
											<input
												type="text"
												placeholder="Module Code"
												value={module.code}
												onChange={e =>
													setModule({
														...module,
														code: e.target.value,
													})
												}
												required
											/>
										</div>
									</div>
									<div className="col-6">
										<div className="row-user">
											<input
												type="text"
												placeholder="Module Name"
												value={module.name}
												onChange={e =>
													setModule({
														...module,
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
										{btnState ? "Saving" : "Save"}
									</button>
								</div>
							</form>
						</div>
					</div>
					<div className="card col-12">
						<h2>Created Modules</h2>
						{isLoading ? (
							<Spinner />
						) : (
							<Table
								limit="5"
								headData={fields}
								renderHead={(item, index) => renderOrderHead(item, index)}
								bodyData={modules}
								renderBody={(item, index) => renderOrderBody(item, index)}
							/>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ManageModules;
