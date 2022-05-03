import axios from "axios";
import React, { useState } from "react";

const RejectReason = ({ orderId }) => {
	console.log("errorId", orderId);
	const [error, setError] = useState("");
	const rejection = async (e) => {
		e.preventDefault();

		let id = orderId;
		let rejectMassage = error;
		try {
			const res = await axios.put(`/orders/error/${id}`, {
				rejectMassage: rejectMassage,
			});
			window.alert("Error message submitted successfully");
			window.location.reload();
			// console.log("rejectionReason", res);
		} catch (error) {
			console.log(error);
		}
	};
	console.log("error", error);
	return (
		<div>
			<div className="layout__content-main">
				<h1 className="page-header">Rejeted Reason</h1>
				<div className="row">
					<div className="col-12">
						<form onSubmit={rejection}>
							<div className="col-6">
								<div className="row-user">
									<input
										type="text"
										onChange={(e) => {
											setError(e.target.value);
										}}
									/>
								</div>
							</div>
							<div className="row-user">
								<button type="submit">Submit</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default RejectReason;
