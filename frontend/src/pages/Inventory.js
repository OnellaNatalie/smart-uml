import axios from "axios";
import React, { useEffect, useState } from "react";
import Sidebar from "../components/sidebar/Sidebar";
import TopNav from "../components/topnav/TopNav";
import Table from "../components/table/Table";
import { Link } from "react-router-dom";
import Badge from "../components/badge/Badge";
import Spinner from "../components/loading/Spinner";

const Inventory = () => {
	const fields = ["", "Item", "Quantity", "Maximum Capacity", "Status"];
	const renderOrderHead = (item, index) => <th key={index}>{item}</th>;

	const [Inventory, setInventory] = useState({
		item: "Sand",
		quantity: 0,
	});
	const [InventoryDetails, setInventoryDetails] = useState([]);
	const [Loading, setLoading] = useState(false);

	const FetchData = async () => {
			const res = await axios.get("/inventory");
			setInventoryDetails(res.data);
			console.log(res.data);
			if(res.statusText === "OK" ){
			setLoading(true)
		}
		
		};

	useEffect(() => {
		
		FetchData();
		
	}, []);

	const inventoryHandler = async () => {
		try {
			console.log(Inventory);
			const res = await axios.patch("/inventory/update", Inventory);
			if(res.statusText === "OK"){
				window.location.reload()
			}
		} catch (Err) {
			console.log(Err.response);
		}
	};

	const renderOrderBody = (item, index) => (
		<tr key={index}>
			<td>{index + 1}</td>
			<td>{item.item}</td>
			<td>{item.quantity}</td>
			<td>{item.maxCapacity}</td>
			<td>
				<div className="row-user" style={{ paddingTop: "0" }}>
					{item.quantity/item.maxCapacity <= 0.4  ? (
						<Badge type="danger" content="Minimum Level" />
					) : item.quantity/item.maxCapacity <= 0.5 ? (
						<Badge type="warning" content="Average Level" />
					) : item.quantity/item.maxCapacity >= 0.5 ? (
						<Badge type="success" content="Maximum Level" />
					):"" }
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
					<h1 className="page-header">Manage Inventory</h1>
					<div className="row ">
						<div className="col-12">
							<div className="card">
								<div className="row ">
									<div className="col-2">
										<h3
											style={{
												paddingTop: 28,
												display: "flex",
												whiteSpace: "nowrap",
												paddingLeft: "25px",
												justifyContent: "center",
												alignItems: "center",
												width: "100%",
											}}
										>
											Select Item
										</h3>
									</div>
									<div className="col-4">
										<div className="row-user">
											<select
												name="position"
												id="position"
												value={Inventory.item}
												onChange={(e) =>
													setInventory({ ...Inventory, item: e.target.value })
												}
												required
											>
												<option value="sand">Sand</option>
												<option value="cement">Cement</option>
												<option value="stone">Stone</option>
												<option value="Iron">Iron</option>
											</select>
										</div>
									</div>
									<div className="col-2">
										<h3
											style={{
												paddingTop: 28,
												display: "flex",
												justifyContent: "center",
												alignItems: "center",
												width: "100%",
											}}
										>
											Quantity
										</h3>
									</div>
									<div className="col-4">
										<div className="row-user">
											<input
												type="number"
												min="1"
												placeholder="Capacity"
												onChange={(e) =>
													setInventory({
														...Inventory,
														quantity: e.target.value,
													})
												}
												required
											/>
										</div>
									</div>
								</div>
								<div style={{ paddingTop: 50 }}>
									<div className="row ">
										<div
											style={{
												display: "flex",
												justifyContent: "center",
												alignItems: "center",
												width: "100%",
											}}
										>
											<div className="row-user">
												<button type="submit" onClick={inventoryHandler}>
													Update
												</button>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="col-2"></div>
					</div>
					<div className="row">
						<div className="col-12">
							<div className="card">
								<div className="flex">
									<h2 className="request-title">Inventory</h2>
								</div>
								{Loading ? (
									<Table
									// limit="5"
									headData={fields}
									renderHead={(item, index) => renderOrderHead(item, index)}
									bodyData={InventoryDetails}
									renderBody={(item, index) => renderOrderBody(item, index)}
								/>
								):<Spinner/>}
								
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Inventory;
