import React, { useContext } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";

import "./BaseLayout.css";

import Main from "../../pages/Main/Main";
import Dashboard from "../../pages/Dashboard/Dashboard";
import EditBoard from "../../pages/EditBoard/EditBoard";
import Board from "../../pages/Board/Board";
import NotFound from "../../pages/NotFound/NotFound";
import Sidebar from "../Sidebar/Sidebar";
import DatabaseContext from "../../../contexts/DatabaseContext";

let boards;

function mainLayout() {
	return (
		<div className="main_layout">
			<Main />
		</div>
	);
}

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

function BoardLayout() {
	return (
		<div className="board_layout">
			<Board />
		</div>
	);
}

function BaseLayout({ page, ...props }) {
	//Get the boards from the context
	const { dbResults } = useContext(DatabaseContext);
	console.log(dbResults);
	boards = dbResults.boards;

	//Get the boardId from the URL
	const { boardId } = useParams();

	//Get the current board using the boardId
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

	//If the boardId in the URL doesn't match one in the db
	//then redirect back to the dashboard
	if (currBoard === undefined) {
		return <Navigate to="/dashboard" />;
	}
	//Render the current board into the page
	if (page === "main") {
		// return <Main {...props} />;
		return mainLayout();
	} else if (page === "dashboard") {
		return SideLayout(currBoard, "dashboard");
	} else if (page === "edit") {
		return SideLayout(currBoard, "edit");
	} else if (page === "board") {
		return BoardLayout();
	} else if (page === "notFound") {
		return <NotFound />;
	}
	return <div className="BaseLayout">Hello World</div>;
}

export default BaseLayout;
