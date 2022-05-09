import React from "react";

import "./Success.css";

const Success = ({ message, style }) => {
	return (
		<div className="success-bg" style={style}>
			<p>{message}</p>
		</div>
	);
};

export default Success;
