import React, { useContext } from "react";
import { Link } from "react-router-dom";

import Dropdown from "../dropdown/Dropdown";

import "./topnav.css";

const renderNotificationItem = (item, index) => (
	<div className="notification-item" key={index}>
		<i className={item.icon}></i>
		<span>{item.content}</span>
	</div>
);

const renderUserToggle = (user) => (
	<div className="topnav__right-user">
		<div className="topnav__right-user__image">
			<img src={user.image} alt="" />
		</div>
		<div className="topnav__right-user__name">{user.display_name}</div>
	</div>
);

const renderUserMenu = (item, index) => (
	<Link to={item.route} key={index}>
		<div className="notification-item" onClick={item.onClick}>
			<i className={item.icon}></i>
			<span>{item.content}</span>
		</div>
	</Link>
);

const TopNav = () => {
	const notifications = [
		{
			icon: "bx bx-bar-chart-square",
			content: `You have ${localStorage.getItem(
				"notifications"
			)} new pending orders`,
		},
	];

	const curr_user = {
		display_name: localStorage.getItem("name"),
	};

	return (
		<div className="topnav">
			<div className="topnav__search">
				<input type="text" placeholder="Search here..." />
				<i className="bx bx-search"></i>
			</div>
			<div className="topnav__right">
				<div className="topnav__right-item">
					<Dropdown
						customToggle={() => renderUserToggle(curr_user)}
						renderItems={(item, index) => renderUserMenu(item, index)}
					/>
				</div>
				<div className="topnav__right-item">
					<Dropdown
						icon="bx bx-bell"
						badge={localStorage.getItem("notifications")}
						contentData={notifications}
						renderItems={(item, index) => renderNotificationItem(item, index)}
						renderFooter={() => <Link to="#">View All</Link>}
					/>
				</div>
			</div>
		</div>
	);
};

export default TopNav;
