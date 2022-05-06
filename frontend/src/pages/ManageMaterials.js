import React, { useEffect, useState } from "react";
import axios from "axios";
import { RiDeleteBinLine } from "react-icons/ri";

import Sidebar from "../components/sidebar/Sidebar";
import Spinner from "../components/loading/Spinner";
import Table from "../components/table/Table";
import TopNav from "../components/topnav/TopNav";

import "../assets/css/Usercreate.css";

const ManageUsers = () => {
	const [btnState, setBtnState] = useState(false);
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const [material, setMaterial] = useState({ code: "", name: "" });
	const [materials, setMaterials] = useState([]);

	const fields = ["", "Material Code", "Material Name", "Actions"];

	const renderOrderHead = (item, index) => <th key={index}>{item}</th>;

	const renderOrderBody = (item, index) => (
		<tr key={index}>
			<td>{index + 1}</td>
			<td>{item.code}</td>
			<td>{item.name}</td>
			<td>
				<>
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
				</>
			</td>
		</tr>
	);

	const saveMaterial = async (e) => {
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
			window.alert("Material registered successfully");
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
				window.alert("Material has been successfully deleted");
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
					<h1 className="page-header">Manage Materials</h1>
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
												placeholder="Material Code"
												value={material.code}
												onChange={(e) =>
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
												placeholder="Material Name"
												value={material.name}
												onChange={(e) =>
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
						<h2>Material Details</h2>
						{isLoading ? (
							<Spinner />
						) : (
							<Table
								limit="5"
								headData={fields}
								renderHead={(item, index) => renderOrderHead(item, index)}
								bodyData={materials}
								renderBody={(item, index) => renderOrderBody(item, index)}
							/>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ManageUsers;
