import React, { useEffect, useState } from "react";

import Sidebar from "../components/sidebar/Sidebar";
import TopNav from "../components/topnav/TopNav";
import Table from "../components/table/Table";
import Spinner from "../components/loading/Spinner";

import "../assets/css/Usercreate.css";
import axios from "axios";

const ManageUsers = () => {
	const [error, setError] = useState("");
	const [btnState, setBtnState] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [siteManagers, setSiteManagers] = useState([]);
	const [sites, setSites] = useState([]);
	const [site, setSite] = useState({
		name: "",
		location: "",
		siteManagerId: "",
	});
	const fields = ["", "Site Name", "Location", "Site Manager", "Email"];

	const renderOrderHead = (item, index) => <th key={index}>{item}</th>;

	const renderOrderBody = (item, index) => (
		<tr key={index}>
			<td>{index + 1}</td>
			<td>{item.name}</td>
			<td>{item.location}</td>
			<td>{item.siteManagerId ? item.siteManagerId.name : "Not Assigned"}</td>
			<td>{item.siteManagerId ? item.siteManagerId.email : "Not Assigned"}</td>
		</tr>
	);

	const saveSite = async (e) => {
		e.preventDefault();
		setBtnState(true);
		for (let key of Object.keys(site)) {
			if (!site[key]) {
				setBtnState(false);
				return setError("Please fill all the fields");
			}
		}

		if (site.siteManagerId === "sitemanager") {
			setBtnState(false);
			return setError("Please fill all the fields");
		}

		try {
			const res = await axios.post("sites", site);
			setSite({
				name: "",
				location: "",
				siteManagerId: "",
			});
			getAllSites();
			setError("");
			window.alert("Site registered successfully");
			setBtnState(false);
			setIsLoading(true);
		} catch (err) {
			setBtnState(false);
			console.log(err.response);
		}
	};

	const getAllSites = async () => {
		try {
			const res = await axios.get(`sites`);
			setSites(res.data.sites);
			console.log(res.data.sites);
			setIsLoading(false);
		} catch (err) {
			console.log(err.response);
		}
	};

	const getAllSiteManagers = async () => {
		try {
			const res = await axios.get(`sitemanagers`);
			setSiteManagers(res.data.sitemanagers);
		} catch (err) {
			console.log(err.response);
		}
	};

	useEffect(() => {
		getAllSites();
		getAllSiteManagers();
	}, []);

	return (
		<div>
			<Sidebar />
			<div id="main" className="layout__content">
				<TopNav />
				<div className="layout__content-main">
					<h1 className="page-header">Manage Sites</h1>
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
												placeholder="Site Name"
												value={site.name}
												onChange={(e) =>
													setSite({
														...site,
														name: e.target.value,
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
												placeholder="Site Location"
												value={site.location}
												onChange={(e) =>
													setSite({
														...site,
														location: e.target.value,
													})
												}
												required
											/>
										</div>
									</div>
									<div className="col-6">
										<div className="row-user">
											<select
												name="site"
												id="site"
												value={site.siteManagerId}
												onChange={(e) =>
													setSite({
														...site,
														siteManagerId: e.target.value,
													})
												}
												required
											>
												<option defaultValue value="sitemanager">
													SELECT SITE MANAGER
												</option>
												{siteManagers.length !== 0 &&
													siteManagers.map((siteManager) => (
														<option value={siteManager._id}>
															{siteManager.name}
														</option>
													))}
											</select>
										</div>
									</div>
								</div>
								<div className="row-user">
									<button type="submit" onClick={saveSite}>
										{btnState ? "Saving" : "Save"}
									</button>
								</div>
							</form>
						</div>
					</div>
					<div className="card">
						<h2>Site Details</h2>
						{isLoading ? (
							<Spinner />
						) : (
							<Table
								limit="5"
								headData={fields}
								renderHead={(item, index) => renderOrderHead(item, index)}
								bodyData={sites}
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
