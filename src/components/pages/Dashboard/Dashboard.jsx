import React from "react";

import "./Dashboard.css";

import Btn from "../../blocks/Btn/Btn";
import Table from "../../blocks/Table/Table";

function ViewBoard({ board }) {
	return (
		<div className="dashboard">
			<div className="dashboard__top">
				<h1 className="dashboard__title">{board.title}</h1>
				<div className="dashboard__right">
					<Btn content="Launch" />
					<Btn content="Edit" />
				</div>
			</div>
			<div className="dashboard__bottom">
				<Table />
			</div>
		</div>
	);
}

export default ViewBoard;
