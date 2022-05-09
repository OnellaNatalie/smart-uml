import axios from "axios";
import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
	const [loggedIn, setLoggedIn] = useState({});
	const [notifications, setNotifications] = useState([]);

	const getLoggedIn = async () => {
		try {
			const res = await axios.get("auth/user/logged", {
				headers: { token: localStorage.getItem("token") },
			});
			console.log(res);
			setLoggedIn({ state: res.data.user.logged, role: res.data.user.user_type });
		} catch (err) {
			console.error(err.message);
		}
	};

	useEffect(() => {
		getLoggedIn();
	}, []);

	return (
		<AuthContext.Provider
			value={{
				loggedIn,
				setLoggedIn,
				getLoggedIn,
				notifications,
				setNotifications,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthContextProvider;
