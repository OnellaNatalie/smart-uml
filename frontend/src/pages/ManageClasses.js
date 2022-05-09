import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { RiDeleteBinLine } from "react-icons/ri";

import Sidebar from "../components/sidebar/Sidebar";
import Spinner from "../components/loading/Spinner";
import Table from "../components/table/Table";
import TopNav from "../components/topnav/TopNav";

import "../assets/css/Usercreate.css";

const ManageClasses = () => {
	const [btnState, setBtnState] = useState(false);
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const [material, setMaterial] = useState({ code: "", name: "" });
	const [materials, setMaterials] = useState([]);

	const fields = ["", "Class Code", "Class Name", "Created At", "Actions"];

	const renderOrderHead = (item, index) => <th key={index}>{item}</th>;
	const classes = [
		{ code: "A001", name: "CTSE", createdAt: "2022-04-05" },
		{ code: "A002", name: "CTSE", createdAt: "2022-04-05" },
		{ code: "A003", name: "CTSE", createdAt: "2022-04-05" },
	];
	const renderOrderBody = (item, index) => (
		<tr key={index}>
			<td>{index + 1}</td>
			<td>{item.code}</td>
			<td>{item.name}</td>
			<td>{item.createdAt}</td>
			<td>
				<div style={{ display: "flex", alignItems: "center" }}>
					<Link to={``}>
						<button className="view-btn">View Class</button>
					</Link>
					<button
						className="action-btn x"
						style={{ marginLeft: "2rem" }}
						onClick={() => {
							if (window.confirm("Are you sure to delete this class?")) {
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
				code: "",
				name: "",
			});
			getAllMaterial();
			setError("");
			window.alert("Class added successfully");
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
				window.alert("Class has been successfully deleted");
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
					<h1 className="page-header">Manage Classes</h1>
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
												placeholder="Class Code"
												value={material.code}
												onChange={e =>
													setMaterial({
														...material,
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
												placeholder="Class Name"
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
										{btnState ? "Saving" : "Save"}
									</button>
								</div>
							</form>
						</div>
					</div>
					<div className="card col-12">
						<h2>Created Classes</h2>
						{false ? (
							<Spinner />
						) : (
							<Table
								limit="5"
								headData={fields}
								renderHead={(item, index) => renderOrderHead(item, index)}
								bodyData={classes}
								renderBody={(item, index) => renderOrderBody(item, index)}
							/>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ManageClasses;
