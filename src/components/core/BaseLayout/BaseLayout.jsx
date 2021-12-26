import React, { useContext } from "react";
import { useParams } from "react-router-dom";

import "./BaseLayout.css";

import Main from "../../pages/Main/Main";
import Dashboard from "../../pages/Dashboard/Dashboard";
import EditBoard from "../../pages/EditBoard/EditBoard";
import NotFound from "../../pages/NotFound/NotFound";
import Board from "../../pages/Board/Board";
import Sidebar from "../Sidebar/Sidebar";
import DatabaseContext from "../../../contexts/DatabaseContext";

let dbResults, boards;

function mainLayout() {
	return (
		<div className="main_layout">
			<Main />
		</div>
	);
}

function sideLayout(currBoard) {
	return (
		<div className="side_layout">
			<div className="side_layout__sidebar">
				<Sidebar />
			</div>
			<div className="side_layout__main">
				<Dashboard board={currBoard} />
			</div>
		</div>
	);
}

function BaseLayout({ page, ...props }) {
	dbResults = useContext(DatabaseContext);
	boards = dbResults.boards;
	const { boardId } = useParams();
	let currBoard;
	if (boardId === undefined) {
		currBoard = boards[0];
	} else {
		for (let i = 0; i < boards.length; i++) {
			if (boards[i].id === boardId) {
				currBoard = boards[i];
			}
		}
	}

	if (page === "main") {
		// return <Main {...props} />;
		return mainLayout();
	} else if (page === "dashboard") {
		return sideLayout(currBoard);
	} else if (page === "edit") {
		return <EditBoard {...props} />;
	} else if (page === "notFound") {
		return <NotFound />;
	}

	return <div className="BaseLayout">Hello World</div>;
}

export default BaseLayout;
