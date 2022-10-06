import axios from "axios";
import { Link, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Sidebar from "../components/sidebar/Sidebar";
import TopNav from "../components/topnav/TopNav";
import { assetsUrl } from "../config/assets.config";

const ViewAssignment = () => {
	const { id } = useParams();
	const [diagrams, setDiagrams] = useState({});
	const [assignment, setAssignment] = useState({});
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

	const getAssignment = async () => {
		setLoading(true);
		try {
			const res = await axios.get("/assignments/" + id);
			console.log(res);
			setAssignment(res.data.assignment);
			setLoading(false);
		} catch (err) {
			console.log(err.response);
		}
	};

	useEffect(() => {
		getDiagrams();
		getAssignment();
	}, []);

	return (
		<div>
			<Sidebar />
			<div id="main" className="layout__content">
				<TopNav />
				<div className="layout__content-main">
					<div className="row">
						<div className="col-10">
							<h1 className="page-header">{assignment.title}</h1>
						</div>
						<div className="col-2" style={{ marginTop: "1rem" }}>
							<Link to={`/auth/teacher/assignments/${id}`}>
								<button className="view-btn">Back to Assignment</button>
							</Link>
						</div>
					</div>

					<div className="row">
						<div className="col-12">
							<div className="card">
								<h3 style={{ paddingBottom: "2rem" }}>Generated usecase diagram</h3>
								<br />
								<div className="flex" style={{ justifyContent: "center" }}>
									<img
										src={assetsUrl + diagrams.usecase_diagram}
										alt="usecase"
										style={{ width: "80%", height: "80%" }}
									/>
								</div>
							</div>
						</div>
					</div>
					<div className="row">
						<div className="col-12">
							<div className="card">
								<h3 style={{ paddingBottom: "2rem" }}>Generated class diagram</h3>
								<br />
								<div className="flex" style={{ justifyContent: "center" }}>
									<img
										src={assetsUrl + diagrams.class_diagram}
										alt="usecase"
										style={{ width: "80%", height: "80%" }}
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
