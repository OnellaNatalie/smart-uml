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
	const [submission, setSubmission] = useState({
		type: "",
		comment: "",
		id: 2,
		file: {},
	});

	const fileHandler = (e) => {
		console.log(e);
		setSubmission({ ...submission, file: e.target.files[0] });
		console.log(submission);
	};

	const FetchData = async () => {
		try {
			const res = await axios.get("assignments/" + id);
			setAssignment(res.data.assignment);
			setSubmission({ ...submission, id: id });
			if (assignment.assignment_type === 1) {
				setSubmission({ ...submission, type: "use case" });
			} else if (assignment.assignment_type === 2) {
				setSubmission({ ...submission, type: "class" });
			} else {
				setSubmission({ ...submission, type: "use case" });
			}
		} catch (error) {
			console.log(error.response);
		}
	};

	const onSubmit = async (e) => {
		e.preventDefault();

		try {
			const res = await axios.post("submissions/upload/", submission, {
				headers: { token: localStorage.getItem("token") },
			});
			window.alert("Assignment added successfully");
			window.location.reload();
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
					<h1 className="page-header"> Assignments</h1>
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
												onChange={fileHandler}
												required
											/>
										</div>
									</div>
									<div className="row-user">
										<button type="submit" onClick={onSubmit}>
											Submit
										</button>
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
