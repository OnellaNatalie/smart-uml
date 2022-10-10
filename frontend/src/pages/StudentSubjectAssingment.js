import axios from "axios";
import React, { useEffect, useState } from "react";
import Sidebar from "../components/sidebar/Sidebar";
import TopNav from "../components/topnav/TopNav";
import { useParams } from "react-router-dom";

const StudentSubjectAssingment = () => {
	const { id } = useParams();

	const [Loading, setLoading] = useState(false);
	const [Trigger, setTrigger] = useState(false);
	const [assignment, setAssignment] = useState([]);

	const FetchData = async () => {
		try {
			const res = await axios.get("assignments/" + id);
			setAssignment(res.data.assignment);
		} catch (error) {
			console.log(error.response);
		}
	};

	useEffect(() => {
		FetchData();
	}, []);

	return (
		<div>
			<Sidebar />
			<div id="main" className="layout__content">
				<TopNav />
				<div className="layout__content-main">
					<h1 className="page-header"> Module Assignments</h1>
					<div className="row">
						<div className="col-12">
							<div className="card">
								<div className="flex">
									<h2 className="request-title">{assignment.title}</h2>
								</div>
								<br />
								<h3>
									Analyze the case study given below and draw a usecase diagram.
								</h3>
								<br />
								<p>{assignment.content}</p>
							</div>
						</div>
					</div>
					<div className="row ">
						<div className="col-12">
							<div className="card">
								<div className="row ">
									<div className="col-6">
										<div className="row-user">
											<input
												style={{ float: "right" }}
												accept=".png, .jpg, .jpeg"
												type="file"
												onChange={(e) => console.log(" submission")}
												required
											/>
										</div>
									</div>
									<div className="row-user">
										<button type="submit">Submit</button>
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

export default StudentSubjectAssingment;
