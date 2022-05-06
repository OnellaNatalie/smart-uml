import React from "react";
import AssignSupplier from "./Assign";
import { AiOutlineClose } from "react-icons/ai";
import Rejection from "./Rejection";
import GoodsReceipt from "./GoodsReceipt";
import RejectReason from "./RejectReason";

function Popup(props) {
	console.log(props);
	return props.trigger ? (
		<div className="Popupout">
			<div className="Popupin">
				<AiOutlineClose
					onClick={() => props.setTrigger(false)}
					className="closeIcone "
				/>
				{props.name === "Assign" ? (
					<AssignSupplier
						item={props.order}
						sitemng={props.sitemng}
						materialId={props.materialId}
						orderId={props.orderId}
						total={props.total}
					/>
				) : props.name === "Rejection" ? (
					<Rejection description={props.description} />
				) : props.name === "GoodsReceipt" ? (
					<GoodsReceipt item={props.item} id={props.id} />
				) : props.name === "rejectReason" ? (
					<RejectReason orderId={props.orderId} />
				) : (
					""
				)}
			</div>
		</div>
	) : (
		<div></div>
	);
}

export default Popup;
