const sidebar_teacher = [
	{
		display_name: "Dashboard",
		route: "/auth/teacher/dashboard",
		icon: "bx bx-category-alt",
	},
	{
		display_name: "Manage Classes",
		route: "/auth/teacher/classes",
		icon: "bx bx-bar-chart-square",
	},
	{
		display_name: "Manage Students",
		route: "/auth/teacher/students",
		icon: "bx bx-user",
	},
	{
		display_name: "Manage Assignments",
		route: "/auth/teacher/assignments",
		icon: "bx bx-book-open",
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
<<<<<<< HEAD
		display_name: "Modules",
		route: "/auth/student/subjects",
		icon: "bx bx-transfer",
	},
	{
=======
		display_name: "Classes",
		route: "/auth/student/classes",
		icon: "bx bx-bar-chart-square",
	},
	{
		display_name: "Assignments",
		route: "/auth/student/assignments",
		icon: "bx bx-book-open",
	},
	{
>>>>>>> 5a709a29340622bd2a4533780b128b2d860d2da0
		display_name: "Sign Out",
		route: "",
		icon: "bx bx-log-out",
	},
];

export { sidebar_teacher, sidebar_student };
