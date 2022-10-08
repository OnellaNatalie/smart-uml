import React from "react";

import "./Spinner.css";

const Spinner = ({ title }) => {
	return (
		<div className="spinner-container">
			<div className="spinner"></div>
			<h2 style={{ paddingTop: "1rem" }}>{title}</h2>
		</div>
	);
};

export default Spinner;
