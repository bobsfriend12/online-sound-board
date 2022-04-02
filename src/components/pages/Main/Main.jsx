import React from "react";
import { Link } from "react-router-dom";

import Btn from "../../blocks/Btn/Btn";

import "./Main.css";

function Main() {
	return (
		<div className="main">
			<Btn
				content={
					<Link className="main__link" to="/dashboard">
						Open Dashboard
					</Link>
				}
			/>
		</div>
	);
}

export default Main;
