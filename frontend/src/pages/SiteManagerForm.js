import axios from "axios";
import React, { useEffect, useState } from "react";
import Sidebar from "../components/sidebar/Sidebar";
import TopNav from "../components/topnav/TopNav";
import Table from "../components/table/Table";
import Badge from "../components/badge/Badge";
import Spinner from "../components/loading/Spinner";
import {MdDelete} from "react-icons/md"
import {VscReport} from "react-icons/vsc"
import Popup from "./Popup";

const SiteManagerForm = () => {
	const siteId = localStorage.getItem("site");
	const [Materials, setMaterials] = useState([]);
	const fields = ["", "Required Date", "Item", "Quantity","Order Status","Delivery Status", "Action", "Goods Receipt"];
	const [OrderDetail, setOrderDetail] = useState([])
	const [Loading, setLoading] = useState(false);
	const [Trigger, setTrigger] = useState(false);
	const [Name, setName] = useState("");
	const [Id, setId] = useState("");
	const [ItemName, setItemName] = useState("")
	const [Description, setDescription] = useState("")
	
	
	const [Order, setOrder] = useState({
		item: {},
		quantity: 0,
		siteid: siteId,
		requiredDate:"",
		urgentOrder:false
	});
	console.log(Order);

	const FetchData = async () => {

			const resMaterials = await axios.get(`materials`);
			setMaterials(resMaterials.data.materials);

			const resOrders = await axios.get("/orders");
			setOrderDetail(resOrders.data.orders);

			if(resOrders.statusText === "OK" ){
				setLoading(true)
			}

		};

	useEffect(() => {
		
		FetchData();
	}, []);

	const deleteHandler = async(id) => {
		console.log(id);
		try{
			const res = await axios.delete(`/orders/delete/${id}`);
			if(res.statusText === "OK" ){
				window.location.reload()
			}
		}catch (Err) {
			console.log(Err.response);
		}
	};

	const orderHandler = async () => {
		try {
			console.log(Order);
			const res = await axios.post("/orders", Order);
			if(res.statusText === "OK" ){
			window.location.reload()
		}
		} catch (Err) {
			console.log(Err.response);
		}
	};

	const renderOrderHead = (item, index) => <th key={index}>{item}</th>;

	const renderOrderBody = (item, index) => (
		<tr key={index}>
			<td>{index + 1}</td>
			<td>{item.requiredDate}</td>
			<td>{item.itemName}</td>
			<td>{item.quantity}</td>
			<td>
				<div className="row-user" style={{ paddingTop: "0" }}>
					{ item.isApprovedByOfficer  === "rejected" ? (
						<Badge type="danger" content={item.isApprovedByOfficer} />
					) : item.isApprovedByManager === "rejected" ? (
						<Badge type="danger" content={item.isApprovedByManager} />
					) :  item.isApprovedByManager === "pending" ? (
						<Badge type="warning" content={item.isApprovedByManager} />
					) : item.isApprovedByManager === "approved" ? (
						<Badge type="success" content={item.isApprovedByManager} />
					)  : (
						""
					)}
				</div>	
			</td>
			<td>
				<div className="row-user" style={{ paddingTop: "0" }}>
					{item.isApprovedByManager === "approved" ? (item.DeliveryStatus === "pending" ? (
						<Badge type="warning" content={item.DeliveryStatus} />
					) : item.DeliveryStatus === "preparing" ? (
						<Badge type="primary" content={item.DeliveryStatus} />
					) : item.DeliveryStatus === "delivering" ? (
						<Badge type="success" content={item.DeliveryStatus} />
					) : item.DeliveryStatus === "delivered" ? (
						<Badge type="success" content={item.DeliveryStatus} />
					) :  item.DeliveryStatus === "submitted" ? (
						<Badge type="normal" content={item.DeliveryStatus} />
					) : (
						""
					)):""}
				</div>	
			</td>
			<td className="">
				{item.isApprovedByManager === "pending" && !(item.isApprovedByOfficer  === "rejected")  ? (
					<>
						<button className="action-btn x">
						<MdDelete
							onClick={() => {
									if (window.confirm("Are you sure to delete this request?")) {
										deleteHandler(item._id);
									}
								}}
						/>
						</button>
					</>
				) : item.isApprovedByManager === "rejected" || item.isApprovedByOfficer === "rejected" ? (
						<>
						<button className="action-btn W">
						<VscReport
							onClick={() => {
									setName("Rejection")
									setDescription(item.rejectMassage)
									setTrigger(true)
									
								}}
						/>
						
						</button>
						<Popup
							trigger = {Trigger}
							name = {Name}
							description = {Description}
							setTrigger = {setTrigger}
							id={Id}
							item={ItemName}
						/>
						</>
				):""}
				
			</td>
			<td>
				{item.DeliveryStatus === "submitted" ? (
					
					
					<div onClick={() => {
									setName("GoodsReceipt")
									setId(item._id)
									setItemName(item.itemName)
									setTrigger(true)
								}}>
					<Badge type="normal" content="view"
					
					/>
					</div>

				) :""

				}
			</td>
		</tr>
	);

	
	return (
		<div>
			<Sidebar />
			<div id="main" className="layout__content">
				<TopNav />
				<div className="layout__content-main">
					<h1 className="page-header">Manage Requisition</h1>
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
												value={Order.item.id}
												onChange={(e) => {
													setOrder({
														...Order,
														item: {
															id: e.target.value,
															name: e.target.options[e.target.selectedIndex]
																.text,
														},
													});
													console.log(e);
												}}
												required
											>
												{Materials.length > 0 &&
													Materials.map((material) => (
														<option value={material._id}>
															{material.name}
														</option>
													))}
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
												min="0"
												placeholder="Quantity"
												onChange={(e) =>
													setOrder({ ...Order, quantity: e.target.value })
												}
												required
											/>
										</div>
									</div>
								</div>
								<div className="row ">
									<div className="col-2">
										<h3
											style={{
												paddingTop: 28,
												display: "flex",
												whiteSpace: "nowrap",
												paddingLeft: "55px",
												justifyContent: "center",
												alignItems: "center",
												width: "100%",
											}}
										>
											Required Date
										</h3>
									</div>
									<div className="col-4">
										<div className="row-user">
										<input type='date'  onChange={(e) =>{ setOrder({ ...Order, requiredDate: e.target.value })
									console.log(Order.requiredDate);}} />
											
										</div>
									</div>
								</div>
								<div className="row ">
									<div style={{
												display: "flex",
												justifyContent: "center",
												alignItems: "center",
												width: "100%",
											}}>
									<div className="row-user" style={{display:'inline',paddingTop: 30 }} >
										
										<input type="checkbox" onChange={(e)=>{setOrder({ ...Order, urgentOrder:!Order.urgentOrder})
									console.log(Order.urgentOrder);}} style={{width:17, height:17, display:'inline'}} />
										<h4 style={{ marginLeft:12,display:'inline'}}>Urgent Order</h4>
										</div>
									</div>
								</div>
								<div style={{ paddingTop: 10 }}>
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
												<button type="submit " onClick={orderHandler}>
													Add
												</button>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="row">
						<div className="col-12">
							<div className="card">
								<div className="flex">
									<h2 className="request-title">All Orders</h2>
								</div>
								{Loading ? <Table
									// limit="5"
									headData={fields}
									renderHead={(item, index) => renderOrderHead(item, index)}
									bodyData={OrderDetail}
									renderBody={(item, index) => renderOrderBody(item, index)}
								/>:<Spinner/>}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SiteManagerForm;
