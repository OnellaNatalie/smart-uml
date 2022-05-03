import React, { useContext } from "react";
import { Route, Switch } from "react-router-dom";

import Assign from "../pages/Assign";
import DeliveryReportSubmit from "../pages/DeliveryReportSubmit";
import Inventory from "../pages/Inventory";
import Login from "../pages/Login";
import ManageAllOrders from "../pages/ManageAllOrders";
import ManageDeliveryReports from "../pages/ManageDeliveryReports";
import ManageMaterials from "../pages/ManageMaterials";
import ManageOrdersSupplier from "../pages/ManageOrdersSupplier";
import ManagerApprovedOrders from "../pages/ManagerApprovedOrders";
import ManagerDashboard from "../pages/ManagerDashboard";
import ManageServices from "../pages/ManageServices";
import ManageSites from "../pages/ManageSites";
import ManageSuppliers from "../pages/ManageSuppliers";
import ManageUsers from "../pages/ManageUsers";
import OfficerDashboard from "../pages/OfficerDashboard";
import OfficerOrders from "../pages/OfficerOrders";
import Register from "../pages/Register";
import SiteManagerDashboard from "../pages/SiteManagerDashboard";
import SiteManagerForm from "../pages/SiteManagerForm";
import SupplierDashboard from "../pages/SupplierDashboard";

import { AuthContext } from "../contexts/AuthContext";

const Routes = () => {
	const { loggedIn } = useContext(AuthContext);

	console.log(loggedIn);

	return (
		<Switch>
			<Route exact path="/" component={Login} />
			<Route exact path="/register" component={Register} />
			<Route
				exact
				path="/auth/manager/dashboard"
				component={ManagerDashboard}
			/>
			<Route exact path="/auth/manager/users" component={ManageUsers} />
			<Route exact path="/auth/manager/sites" component={ManageSites} />
			<Route exact path="/auth/manager/materials" component={ManageMaterials} />
			<Route exact path="/auth/manager/suppliers" component={ManageSuppliers} />
			<Route
				exact
				path="/auth/supplier/dashboard"
				component={SupplierDashboard}
			/>
			<Route
				exact
				path="/auth/supplier/orders"
				component={ManageOrdersSupplier}
			/>
			<Route exact path="/auth/supplier/services" component={ManageServices} />
			<Route
				exact
				path="/auth/supplier/deliveryreports/:id"
				component={DeliveryReportSubmit}
			/>
			<Route
				exact
				path="/auth/supplier/deliveryreports"
				component={ManageDeliveryReports}
			/>
			<Route
				exact
				path="/auth/officer/dashboard"
				component={OfficerDashboard}
			/>
			<Route
				exact
				path="/auth/sitemanager/dashboard"
				component={SiteManagerDashboard}
			/>

			<Route exact path="/auth/officers/orderlist" component={OfficerOrders} />
			<Route exact path="/auth/officers/form" component={Assign} />
			<Route
				exact
				path="/auth/sitemanager/requisitions"
				component={SiteManagerForm}
			/>
			<Route exact path="/auth/sitemanager/inventory" component={Inventory} />
			<Route exact path="/auth/manager/allorders" component={ManageAllOrders} />
			<Route
				exact
				path="/auth/manager/ApprovedOrders"
				component={ManagerApprovedOrders}
			/>
		</Switch>
	);
};

export default Routes;
