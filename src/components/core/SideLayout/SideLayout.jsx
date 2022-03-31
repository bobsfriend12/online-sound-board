import React from "react";

import "./SideLayout.css";

import Sidebar from "../Sidebar/Sidebar";
import Dashboard from "../../pages/Dashboard/Dashboard";
import EditBoard from "../../pages/EditBoard/EditBoard";

function SideLayout(currBoard, page) {
	return (
		<div className="side_layout">
			<div className="side_layout__sidebar">
				<Sidebar />
			</div>
			<div className="side_layout__main">
				{page === "dashboard" ? (
					<Dashboard board={currBoard} />
				) : (
					<EditBoard board={currBoard} />
				)}
			</div>
		</div>
	);
}

export default SideLayout;
