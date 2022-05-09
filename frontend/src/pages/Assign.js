import axios from "axios";
import React, { useEffect, useState } from "react";

const AssignSupplier = ({ item, sitemng, materialId, orderId, total }) => {
	const [supliers, setSupliers] = useState([]);
	const [supplierId, setSupplierId] = useState("");
	const [service, setService] = useState("");
	const [count, setcount] = useState("");

	console.log(total);
	const getSuppliers = async () => {
		let id = materialId;

		try {
			const res = await axios.get(`/suppliers/services/${id}`);
			setSupliers(res.data.supplierlist);
		} catch (error) {
			console.log(error);
		}
	};

	const getservices = async () => {
		let id = materialId;
		try {
			const res = await axios.get(`/suppliers/services/details/${id}`);
			setService(res.data.servicedetails);
			console.log(res);
			console.log(res.data);
			console.log(service);
		} catch (error) {
			console.log(error);
		}
	};
	const setTotal = async (e) => {
		e.preventDefault();
		console.log("order", orderId);
		console.log("total", total);
		getservices();

		let id = orderId;
		total = service.units * service.pricePerUnit;
		console.log("total", total);

		try {
			const res = await axios.put(`/officer/total/${id}`, { total: total });
			console.log(res);
		} catch (error) {
			console.log(error.response);
		}
	};

	const addSuplier = async (e) => {
		e.preventDefault();
		let id = orderId;
		try {
			const res = await axios.put(`/orders/${id}`, { supplierId: supplierId });
			setTotal();
			// console.log(res);
			window.alert("Supplier ID  added successfully");
			window.location.reload();
		} catch (error) {
			console.log(error.response);
		}
	};

	// console.log(supplierId);
	useEffect(() => {
		getSuppliers();
	}, []);

	return (
		<div>
			<div className="layout__content-main">
				<h1 className="page-header">Add Supplier</h1>
				<div className="row">
					<div className="col-12">
						<div className="row-user">
							<p className="page-header" style={{ size: "20px" }}>
								{item}
							</p>
						</div>

						<form
							className="card"
							style={{ position: "relative" }}
							onSubmit={addSuplier}
						>
							<div className="col-2"></div>
							<div className="col-6">
								<div className="row-user">
									<select
										name="site"
										id="site"
										onChange={(e) => {
											setSupplierId(e.target.value);
											console.log(e.target.value);

											console.log(supplierId);
										}}
										required
									>
										<option value="site">SELECT SUPPLIER</option>
										{supliers.map((suplier) => (
											<option value={suplier.supplierId._id} key={suplier._id}>
												{suplier.supplierId.name + " " + suplier.pricePerUnit}
											</option>
										))}
									</select>
								</div>
							</div>

							<div className="row-user">
								<button type="submit">Add supplier</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AssignSupplier;
