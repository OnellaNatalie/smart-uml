import React, { useContext } from "react";
import { Route, Switch } from "react-router-dom";

import Assign from "../pages/Assign";
import DeliveryReportSubmit from "../pages/DeliveryReportSubmit";
import Inventory from "../pages/Inventory";
import Login from "../pages/Login";
import ManageAllOrders from "../pages/ManageAllOrders";
import ManageDeliveryReports from "../pages/ManageDeliveryReports";
<<<<<<< HEAD
import ManageMaterials from "../pages/ManageMaterials";
import SubjectsStudent from "../pages/SubjectsStudent";
=======
import ManageAssignments from "../pages/ManageAssignments";
import ManageOrdersSupplier from "../pages/ManageOrdersSupplier";
>>>>>>> 5a709a29340622bd2a4533780b128b2d860d2da0
import ManagerApprovedOrders from "../pages/ManagerApprovedOrders";
import TeacherDashboard from "../pages/TeacherDashboard";
import ManageServices from "../pages/ManageServices";
import ManageStudents from "../pages/ManageStudents";
import ManageClasses from "../pages/ManageClasses";
import OfficerDashboard from "../pages/OfficerDashboard";
import OfficerOrders from "../pages/OfficerOrders";
import Register from "../pages/Register";
import SiteManagerDashboard from "../pages/SiteManagerDashboard";
import SiteManagerForm from "../pages/SiteManagerForm";
import StudentDashboard from "../pages/StudentDashboard";

import { AuthContext } from "../contexts/AuthContext";

const Routes = () => {
	const { loggedIn } = useContext(AuthContext);

	console.log(loggedIn);

	return (
		<Switch>
			
			<Route exact path="/" component={Login} />
			<Route exact path="/register" component={Register} />
			<Route exact path="/login" component={Login} />

			<Route exact path="/auth/teacher/dashboard" component={TeacherDashboard} />
			<Route exact path="/auth/teacher/users" component={ManageUsers} />
			<Route exact path="/auth/teacher/sites" component={ManageSites} />
			<Route exact path="/auth/teacher/materials" component={ManageMaterials} />
			<Route exact path="/auth/teacher/suppliers" component={ManageSuppliers} />
			<Route exact path="/auth/student/dashboard" component={StudentDashboard} />
			<Route exact path="/auth/student/subjects" component={SubjectsStudent} />
			<Route exact path="/auth/teacher/students" component={ManageStudents} />
			<Route exact path="/auth/teacher/classes" component={ManageClasses} />
			<Route exact path="/auth/teacher/assignments" component={ManageAssignments} />

			<Route exact path="/auth/student/dashboard" component={SupplierDashboard} />
			<Route exact path="/auth/student/modules" component={ManageOrdersSupplier} />
			<Route exact path="/auth/student/services" component={ManageServices} />
			<Route exact path="/auth/student/deliveryreports/:id" component={DeliveryReportSubmit} />
			<Route exact path="/auth/student/deliveryreports" component={ManageDeliveryReports} />

			<Route exact path="/auth/officer/dashboard" component={OfficerDashboard} />
			{/* <Route exact path="/auth/sitemanager/dashboard" component={SiteManagerDashboard} /> */}
			<Route exact path="/auth/officers/orderlist" component={OfficerOrders} />
			<Route exact path="/auth/officers/form" component={Assign} />
			<Route exact path="/auth/sitemanager/requisitions" component={SiteManagerForm} />
			<Route exact path="/auth/sitemanager/inventory" component={Inventory} />
			<Route exact path="/auth/manager/allorders" component={ManageAllOrders} />
			<Route exact path="/auth/manager/ApprovedOrders" component={ManagerApprovedOrders} />
		</Switch>
	);
};

export default Routes;
