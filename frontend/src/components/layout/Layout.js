import React from "react";
import { BrowserRouter } from "react-router-dom";

import "./layout.css";

import Routes from "../../routes/Routes";

const Layout = () => {
	return (
		<BrowserRouter>
			<Routes />
		</BrowserRouter>
	);
};

export default Layout;
