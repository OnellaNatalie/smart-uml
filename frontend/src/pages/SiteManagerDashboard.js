import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/sidebar/Sidebar";
import TopNav from "../components/topnav/TopNav";
import Table from "../components/table/Table";
import AdminGreeting from "../assets/images/admin-greeting.png";
import Badge from "../components/badge/Badge";
import "../components/badge/badge.css";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import profilePicture from "../assets/images/user2.jpg";
import Spinner from "../components/loading/Spinner";
import axios from "axios";

const SiteManagerDashboard = () => {
	const [value, onChange] = useState(new Date());
	const fields = ["", "Required Date", "Item", "Quantity", "Delivery Status"];
	const [OrderDetail, setOrderDetail] = useState([])
	const [Loading, setLoading] = useState(false);

	useEffect(() => {
		const FetchData = async () => {
			const res = await axios.get("/orders/approved");
			setOrderDetail(res.data.orders);
			console.log(res.data);
			if(res.statusText === "OK" ){
			setLoading(true)
		}
		
		};
		FetchData();
		
	}, []);

	const renderOrderHead = (item, index) => <th key={index}>{item}</th>;

	const renderOrderBody = (item, index) => (
		<tr key={index}>
			<td>{index + 1}</td>
			<td>{item.requiredDate}</td>
			<td>{item.itemName}</td>
			<td>{item.quantity}</td>
			<td>
				<div className="row-user" style={{ paddingTop: "0" }}>
					{item.DeliveryStatus === "pending" ? (
						<Badge type="warning" content={item.DeliveryStatus} />
					) : item.DeliveryStatus === "preparing" ? (
						<Badge type="primary" content={item.DeliveryStatus} />
					) : item.DeliveryStatus === "delivering" ? (
						<Badge type="success" content={item.DeliveryStatus} />
					) : item.DeliveryStatus === "delivered" ? (
						<Badge type="success" content={item.DeliveryStatus} />
					) : (
						""
					)}
				</div>
			</td>
		</tr>
	);

	return (
		<div>
			<Sidebar />
			<div id="main" className="layout__content">
				<TopNav />
				<div className="layout__content-main">
					<div className="row">
						<div className="col-8 full-width">
							<div className="card greeting-card">
								<div className="row">
									<div className="col-8 flex-column">
										<h1 className="page-header">Good Morning! </h1>
										<h3>Today you have 9 new notifications</h3>
										<h3>Also new booking appointments for approval</h3>
										<Link className="read-more">
											Read more <i className="bx bx-right-arrow-alt"></i>
										</Link>
									</div>
									<div className="col-4">
										<img
											className="admin-greeting"
											src={AdminGreeting}
											alt=""
										/>
									</div>
								</div>
							</div>
						</div>
						<div className="col-4 full-width">
							<div className="card">
								<h2
									className="request-title"
									style={{ color: "transparent", marginBottom: "-.2rem" }}
								>
									Calender
								</h2>
								<Calendar
									className="calender"
									onChange={onChange}
									value={value}
								/>
							</div>
						</div>
					</div>
					<div className="row">
						<div className="col-8">
							<div className="card">
								<div className="flex">
									<h2 className="request-title">New Orders</h2>
									<Link to={`/auth/sitemanager/requisitions`}>
										<button className="view-btn">View All</button>
									</Link>
								</div>
								{Loading ? <Table
									limit="5"
									headData={fields}
									renderHead={(item, index) => renderOrderHead(item, index)}
									bodyData={OrderDetail}
									renderBody={(item, index) => renderOrderBody(item, index)}
								/>:<Spinner/>}
							</div>
						</div>
						<div className="col-4">
							<div className="card">
								<div className="row">
									<div className="col-4 full-width-1496">
										<img
											src={profilePicture}
											alt=""
											className="profile-picture"
										/>
									</div>
									<div className="col-8">
										<h2>{localStorage.getItem("name")}</h2>
										<h3 className="lighter">SITE MANAGER</h3>
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

export default SiteManagerDashboard;
