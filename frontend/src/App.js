import { useEffect } from "react";
import AOS from "aos";

import "boxicons/css/boxicons.min.css";
import "aos/dist/aos.css";
import "./App.css";
import "./assets/css/grid.css";
import "./assets/css/theme.css";
import "./assets/css/index.css";
import "./assets/css/Usercreate.css";

import "./config/axios.config";

import AuthContextProvider from "./contexts/AuthContext";

import Layout from "./components/layout/Layout";

function App() {
	useEffect(() => {
		AOS.init({
			offset: 200,
			duration: 1000,
			disable: function () {
				let maxWidth = 900;
				return window.innerWidth < maxWidth;
			},
		});
	});

	return (
		<AuthContextProvider>
			<Layout />
		</AuthContextProvider>
	);
}

export default App;
