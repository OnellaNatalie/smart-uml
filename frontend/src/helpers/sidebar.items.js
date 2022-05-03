const sidebar_manager = [
	{
		display_name: "Dashboard",
		route: "/auth/manager/dashboard",
		icon: "bx bx-category-alt",
	},
	{
		display_name: "Manage Users",
		route: "/auth/manager/users",
		icon: "bx bx-user",
	},
	{
		display_name: "Manage Sites",
		route: "/auth/manager/sites",
		icon: "bx bx-buildings",
	},
	{
		display_name: "Manage Materials",
		route: "/auth/manager/materials",
		icon: "bx bx-cube",
	},
	{
		display_name: "Manage Orders",
		route: "/auth/manager/allorders",
		icon: "bx bx-bar-chart-square",
	},
	{
		display_name: "Manage Suppliers",
		route: "/auth/manager/suppliers",
		icon: "bx bx-group",
	},
	{
		display_name: "Sign Out",
		route: "",
		icon: "bx bx-log-out",
	},
];

const sidebar_site_manager = [
	{
		display_name: "Dashboard",
		route: "/auth/sitemanager/dashboard",
		icon: "bx bx-category-alt",
	},
	{
		display_name: "Requisitions",
		route: "/auth/sitemanager/requisitions",
		icon: "bx bx-transfer",
	},
	{
		display_name: "Inventory",
		route: "/auth/sitemanager/inventory",
		icon: "bx bx-store",
	},
	{
		display_name: "Sign Out",
		route: "",
		icon: "bx bx-log-out",
	},
];

const sidebar_officer = [
	{
		display_name: "Dashboard",
		route: "/auth/officer/dashboard",
		icon: "bx bx-category-alt",
	},
	{
		display_name: "Manage Orders",
		route: "/auth/officers/orderlist",
		icon: "bx bx-bar-chart-square",
	},
	{
		display_name: "Inventory",
		route: "/auth/officer/inventory",
		icon: "bx bx-store",
	},
	{
		display_name: "Sign Out",
		route: "",
		icon: "bx bx-log-out",
	},
];

const sidebar_supplier = [
	{
		display_name: "Dashboard",
		route: "/auth/supplier/dashboard",
		icon: "bx bx-category-alt",
	},
	{
		display_name: "Manage Orders",
		route: "/auth/supplier/orders",
		icon: "bx bx-bar-chart-square",
	},
	{
		display_name: "Manage Services",
		route: "/auth/supplier/services",
		icon: "bx bx-store",
	},
	{
		display_name: "Delivery Reports",
		route: "/auth/supplier/deliveryreports",
		icon: "bx bx-notepad",
	},
	{
		display_name: "Sign Out",
		route: "",
		icon: "bx bx-log-out",
	},
];
export {
	sidebar_manager,
	sidebar_site_manager,
	sidebar_officer,
	sidebar_supplier,
};
