import axios from "axios";
import { Link, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Sidebar from "../components/sidebar/Sidebar";
import TopNav from "../components/topnav/TopNav";
import { assetsUrl } from "../config/assets.config";

const ViewAssignment = () => {
	const { id } = useParams();
	const [diagrams, setDiagrams] = useState({});
	const [Loading, setLoading] = useState(false);

	const getDiagrams = async () => {
		setLoading(true);
		try {
			const res = await axios.get("/diagrams/" + id);
			console.log(res);
			setDiagrams(res.data.diagrams);
			setLoading(false);
		} catch (err) {
			console.log(err.response);
		}
	};

	useEffect(() => {
		getDiagrams();
	}, []);

	return (
		<div>
			<Sidebar />
			<div id="main" className="layout__content">
				<TopNav />
				<div className="layout__content-main">
					<div className="row">
						<div className="col-10">
							<h1 className="page-header">CTSE Assignment 01</h1>
						</div>
						<div className="col-1" style={{ marginTop: "1rem" }}>
							<Link to={`/auth/teacher/assignments/${id}`}>
								<button className="view-btn">Back to Assignment</button>
							</Link>
						</div>
					</div>

					<div className="row">
						<div className="col-12">
							<div className="card">
								<h3>Generated usecase diagram</h3>
								<br />
								<div className="flex" style={{ justifyContent: "center" }}>
									<img
										src={assetsUrl + diagrams.usecase_diagram}
										alt="usecase"
										style={{ width: "100%", height: "100%" }}
									/>
								</div>
							</div>
						</div>
					</div>
					<div className="row">
						<div className="col-12">
							<div className="card">
								<h3>Generated class diagram</h3>
								<br />
								<div className="flex" style={{ justifyContent: "center" }}>
									<img
										src={assetsUrl + diagrams.class_diagram}
										alt="usecase"
										style={{ width: "100%", height: "100%" }}
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ViewAssignment;
