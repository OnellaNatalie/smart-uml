const date = new Date();
let hours = date.getHours();
let status =
	hours < 12 ? "Morning" : hours <= 18 && hours >= 12 ? "Afternoon" : "Evening";

export default status;
