import React, { useState, useEffect } from "react";
import Sidebar from "../components/sidebar/Sidebar";
import TopNav from "../components/topnav/TopNav";
import Table from "../components/table/Table";
import Badge from "../components/badge/Badge";
import axios from "axios";
import { MdDelete } from "react-icons/md";

const ManagerApprovedOrders = () => {
  const fields = [
    "Order ID",
    "Item Name",
    "Quantity",
    "Total",
    "Created Date",
    "Status",
    "Actions",
  ];

  const [allorders, setAllOrders] = useState(null);

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
          type={permissionStatus[item.isApprovedByManager]}
          content={item.isApprovedByManager}
        />
      </td>
      <td>
        <button
          className="action-btn check"
          onClick={() => {
            if (window.confirm("Are you sure to Approve this request?")) {
              changeStatusToApproved(item._id);
            }
          }}
        >
          <i className="bx bx-check"></i>
        </button>
        <button className="action-btn x">
          <MdDelete
            onClick={() => {
              if (window.confirm("Are you sure to reject this request?")) {
                changeStatusToRejected(item._id);
                console.log(item.id);
              }
            }}
          />
        </button>
      </td>
    </tr>
  );
  const permissionStatus = {
    pending: "warning",
    approved: "success",
    rejected: "danger",
  };
  const getApproveOrders = async () => {
    try {
      const res = await axios.get("orders/getApproveOrders");
      setAllOrders(res.data.orders);
    } catch (err) {
      console.log(err.response);
    }
  };
  const changeStatusToRejected = async (id) => {
    try {
      const res = await axios.patch(`orders/changeStatusToRejected/${id}`);
      window.location.reload();
      // console.log(res.data);
    } catch (err) {
      console.log(err.response);
    }
  };
  const changeStatusToApproved = async (id) => {
    try {
      const res = await axios.patch(`orders/changeStatusToApproved/${id}`);
      window.location.reload();
      // console.log(res.data);
    } catch (err) {
      console.log(err.response);
    }
  };

  useEffect(() => {
    getApproveOrders();
  }, []);

  return (
    <div>
      <Sidebar />

      <div id="main" className="layout__content">
        <TopNav />
        <div className="layout__content-main">
          <div className="card">
            <h2>Approved Orders from Officer</h2>
            {allorders && (
              <Table
                limit="10"
                headData={fields}
                renderHead={(item, index) => renderOrderHead(item, index)}
                bodyData={allorders}
                renderBody={(item, index) => renderOrderBody(item, index)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerApprovedOrders;
