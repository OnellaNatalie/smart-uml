import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/sidebar/Sidebar";
import TopNav from "../components/topnav/TopNav";
import Table from "../components/table/Table";
import Badge from "../components/badge/Badge";
import axios from "axios";

const ManageAllOrders = () => {
  const fields = [
    "Order ID",
    "Item Name",
    "Quantity",
    "Total",
    "Created Date",
    "Status",
  ];

  const [orders, setOrders] = useState(null);

  const renderOrderHead = (item, index) => <th key={index}>{item}</th>;

  const renderOrderBody = (item, index) => (
    <tr key={index}>
      <td>{index + 1}</td>
      <td>{item.itemName}</td>
      <td>{item.quantity}</td>
      <td>{item.total}</td>
      <td>{new Date(item.createdAt).toLocaleDateString()}</td>
      <td>
        <Badge
          type={permissionStatus[item.isApprovedByOfficer]}
          content={item.isApprovedByOfficer}
        />
      </td>
    </tr>
  );

  const getAllOrder = async () => {
    const res = await axios.get("orders/getAllOrdersByManager");

    console.log(res.data.orders);
    setOrders(res.data.orders);
  };

  useEffect(() => {
    getAllOrder();
  }, []);
  const permissionStatus = {
    pending: "warning",
    approved: "success",
    rejected: "danger",
  };
  return (
    <div>
      <Sidebar />
      <div id="main" className="layout__content">
        <TopNav />
        <div className="layout__content-main">
          <div className="card">
            <h2>All Order Details</h2>
            {orders && (
              <Table
                limit="10"
                headData={fields}
                renderHead={(item, index) => renderOrderHead(item, index)}
                bodyData={orders}
                renderBody={(item, index) => renderOrderBody(item, index)}
              />
            )}
          </div>
          <Link to={"/auth/manager/ApprovedOrders"}>
            <div className="row-user">
              <button>Approved Orders</button>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ManageAllOrders;
