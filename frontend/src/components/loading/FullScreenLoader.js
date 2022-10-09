import React from "react";

import "./Spinner.css";
import Spinner from "./Spinner";

const FullScreenLoader = ({ title }) => {
	return (
		<div className="full-screen-loader">
			<Spinner title={title} />
		</div>
	);
};

export default FullScreenLoader;
