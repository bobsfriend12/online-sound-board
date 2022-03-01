import React from "react";
import { Link } from "react-router-dom";

import "./Dashboard.css";

import Btn from "../../blocks/Btn/Btn";
import Table from "../../blocks/Table/Table";

function ViewBoard({ board }) {
	return (
		<div className="dashboard">
			<div className="dashboard__top">
				<h1 className="dashboard__title">{board.title}</h1>
				<div className="dashboard__right">
					<Btn
						content={
							<Link
								className="dashboard__link"
								to={`/board/${board.id}`}
							>
								Launch
							</Link>
						}
					/>
					<Btn
						content={
							<Link
								className="dashboard__link"
								to={"/edit/" + board.id}
							>
								Edit
							</Link>
						}
					/>
				</div>
			</div>
			<div className="dashboard__bottom">
				<Table sounds={board.sounds} />
			</div>
		</div>
	);
}

export default ViewBoard;
