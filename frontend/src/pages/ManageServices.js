import React, { useEffect, useState } from "react";
import axios from "axios";
import { RiDeleteBinLine } from "react-icons/ri";

import Sidebar from "../components/sidebar/Sidebar";
import TopNav from "../components/topnav/TopNav";
import Table from "../components/table/Table";
import Spinner from "../components/loading/Spinner";

import "../assets/css/Usercreate.css";

const ManageServices = () => {
	const [error, setError] = useState("");
	const [btnState, setBtnState] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [employees, setEmployees] = useState([]);
	const [materials, setMaterials] = useState([]);
	const [serviceDetails, setServiceDetails] = useState({
		material: "",
		units: "",
		pricePerUnit: "",
	});
	const fields = ["", "Material ", "Units", "Price per Unit", "Actions"];

	const renderOrderHead = (item, index) => <th key={index}>{item}</th>;

	const renderOrderBody = (item, index) => (
		<tr key={index}>
			<td>{index + 1}</td>
			<td>{item.materialId.name}</td>
			<td>{item.units}</td>
			<td>{item.pricePerUnit}</td>
			<td>
				<>
					<button
						className="action-btn x"
						onClick={() => {
							if (window.confirm("Are you sure to delete this service?")) {
								deleteHandler(item._id);
							}
						}}
					>
						<RiDeleteBinLine />
					</button>
				</>
			</td>
		</tr>
	);

	const saveServiceDetails = async (e) => {
		e.preventDefault();
		setBtnState(true);

		for (let key of Object.keys(serviceDetails)) {
			if (!serviceDetails[key]) {
				setBtnState(false);
				return setError("Please fill all the fields");
			}
		}

		try {
			const res = await axios.post("suppliers/services", serviceDetails);
			setServiceDetails({
				material: "",
				units: "",
				pricePerUnit: "",
			});

			getAllData();
			setError("");
			window.alert("Service registered successfully");
			setBtnState(false);
			setIsLoading(true);
		} catch (err) {
			setBtnState(false);
			console.log(err.response);
		}
	};

	const deleteHandler = async (id) => {
		console.log(id);
		try {
			const res = await axios.delete(
				`suppliers/services/${id}`,
				serviceDetails
			);

			if (res.statusText === "OK") {
				getAllData();
				setError("");
				window.alert("Service has been successfully deleted");
				setIsLoading(true);
			}
		} catch (err) {
			console.log(err.response);
		}
	};

	const getAllData = async () => {
		try {
			const res1 = await axios.get(`suppliers/services/my`);
			const res2 = await axios.get(`materials`);
			setEmployees(res1.data.services);
			setMaterials(res2.data.materials);
			setIsLoading(false);
		} catch (err) {
			console.log(err.response);
		}
	};

	useEffect(() => getAllData(), []);

	return (
		<div>
			<Sidebar />
			<div id="main" className="layout__content">
				<TopNav />
				<div className="layout__content-main">
					<h1 className="page-header">Manage Services</h1>
					<div className="row">
						<div className="col-12">
							<form className="card" style={{ position: "relative" }}>
								{error && (
									<div className="error-bg" style={{ left: "3%" }}>
										<p>{error}</p>
									</div>
								)}
								<div className="row">
									<div className="col-4">
										<div className="row-user">
											<select
												name="site"
												id="site"
												value={serviceDetails.material}
												onChange={(e) =>
													setServiceDetails({
														...serviceDetails,
														material: e.target.value,
													})
												}
												required
											>
												<option value="site" defaultValue>
													SELECT MATERIAL
												</option>
												{materials.length > 0 &&
													materials.map((material) => (
														<option value={material._id}>
															{material.name}
														</option>
													))}
											</select>
										</div>
									</div>
									<div className="col-4">
										<div className="row-user">
											<input
												type="number"
												placeholder="Units"
												value={serviceDetails.units}
												onChange={(e) =>
													setServiceDetails({
														...serviceDetails,
														units: e.target.value,
													})
												}
												required
											/>
										</div>
									</div>
									<div className="col-4">
										<div className="row-user">
											<input
												type="number"
												placeholder="Price per unit"
												value={serviceDetails.pricePerUnit}
												onChange={(e) =>
													setServiceDetails({
														...serviceDetails,
														pricePerUnit: e.target.value,
													})
												}
												required
											/>
										</div>
									</div>
								</div>
								<div className="row-user">
									<button type="submit" onClick={saveServiceDetails}>
										{btnState ? "Saving" : "Save"}
									</button>
								</div>
							</form>
						</div>
					</div>
					<div className="card">
						<h2>My Services Details</h2>
						{isLoading ? (
							<Spinner />
						) : (
							<Table
								limit="10"
								headData={fields}
								renderHead={(item, index) => renderOrderHead(item, index)}
								bodyData={employees}
								renderBody={(item, index) => renderOrderBody(item, index)}
							/>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ManageServices;
