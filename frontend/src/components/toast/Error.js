import React from "react";

import "./Error.css";

const Error = ({ message, style }) => {
	return (
		<div className="error-bg" style={style}>
			<p>{message}</p>
		</div>
	);
};

export default Error;
