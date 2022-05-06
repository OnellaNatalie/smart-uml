import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

import Sidebar from "../components/sidebar/Sidebar";
import TopNav from "../components/topnav/TopNav";

import "../assets/css/Usercreate.css";

const DeliveryReportSubmit = () => {
	const { id } = useParams();
	const [btnState, setBtnState] = useState(false);
	const [error, setError] = useState("");
	const [deliveryReport, setDeliveryReport] = useState({});

	const saveDeliveryReport = async (e) => {
		e.preventDefault();
		setBtnState(true);

		if (!deliveryReport.description) {
			setBtnState(false);
			return setError("Please fill all the fields");
		}

		try {
			const res = await axios.post("/reports/deliveryreport", deliveryReport);

			if (res.status === 201) {
				setDeliveryReport({});
				getOrderDetails();
				setError("");
				const res = await axios.put(`orders/supplier/submitted/${id}`);
				if (res.status === 200) {
					window.alert("Delivery report registered successfully");
					window.location.href = "/auth/supplier/deliveryreports";
				}
			}
			setBtnState(false);
		} catch (err) {
			setBtnState(false);
			console.log(err.response);
		}
	};

	const getOrderDetails = async () => {
		try {
			const res = await axios.get(`orders/${id}`);
			console.log(res.data);
			setDeliveryReport(res.data.order);
		} catch (err) {
			console.log(err.response);
		}
	};

	useEffect(() => getOrderDetails(), []);

	return (
		<div>
			<Sidebar />
			<div id="main" className="layout__content">
				<TopNav />
				<div className="layout__content-main">
					<h1 className="page-header">Submit Delivery Report</h1>
					<div className="row">
						<div className="col-12">
							<form className="card" style={{ position: "relative" }}>
								{error && (
									<div className="error-bg" style={{ left: "3%" }}>
										<p>{error}</p>
									</div>
								)}
								<div className="row">
									<div className="col-4">
										<label htmlFor="">Order Item</label>
										<div className="row-user">
											<input
												disabled
												type="text"
												placeholder="Delivered Item"
												value={deliveryReport.itemName}
												required
											/>
										</div>
									</div>
									<div className="col-4">
										<label htmlFor="">Order ID</label>
										<div className="row-user">
											<input
												disabled
												type="text"
												placeholder="Order ID"
												value={deliveryReport._id}
												required
											/>
										</div>
									</div>
									<div className="col-4">
										<label htmlFor="">Quantity</label>
										<div className="row-user">
											<input
												disabled
												type="text"
												placeholder="Quantity"
												value={deliveryReport.quantity}
												required
											/>
										</div>
									</div>
								</div>
								<div className="row">
									<div className="col-4">
										<label htmlFor="">Total</label>
										<div className="row-user">
											<input
												disabled
												type="text"
												placeholder="Delivered Item"
												value={deliveryReport.total}
												required
											/>
										</div>
									</div>
									<div className="col-4">
										<label htmlFor="">Order Type</label>
										<div className="row-user">
											<input
												disabled
												type="text"
												placeholder="Order ID"
												value={
													deliveryReport.urgentOrder === false
														? "Regular Order"
														: "Urgent Order"
												}
												required
											/>
										</div>
									</div>
								</div>
								<div className="row">
									<div className="col-12">
										<div className="row-user">
											<input
												type="text"
												placeholder="Description"
												value={deliveryReport.description}
												onChange={(e) =>
													setDeliveryReport({
														...deliveryReport,
														description: e.target.value,
													})
												}
												required
											/>
										</div>
									</div>
								</div>
								<div className="row-user">
									<button type="submit" onClick={saveDeliveryReport}>
										{btnState ? "Saving" : "Save"}
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default DeliveryReportSubmit;
