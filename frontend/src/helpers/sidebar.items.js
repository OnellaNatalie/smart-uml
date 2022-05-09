const sidebar_teacher = [
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

const sidebar_student = [
	{
		display_name: "Dashboard",
		route: "/auth/student/dashboard",
		icon: "bx bx-category-alt",
	},
	{
		display_name: "Modules",
		route: "/auth/student/subjects",
		icon: "bx bx-transfer",
	},
	{
		display_name: "Sign Out",
		route: "",
		icon: "bx bx-log-out",
	},
];

export { sidebar_teacher, sidebar_student };
