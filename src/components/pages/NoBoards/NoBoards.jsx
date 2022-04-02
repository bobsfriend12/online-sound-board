import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import "./NoBoards.css";

import Btn from "../../blocks/Btn/Btn";
import Modal from "../../blocks/Modal/Modal";
import DatabaseContext from "../../../contexts/DatabaseContext";

function NoBoards() {
	const [show, setShow] = useState(false);
	const context = useContext(DatabaseContext);
	const { dbResults, editBoard } = context;
	const boards = dbResults.boards;

	let navigate = useNavigate();

	function onSave(newBoardObj) {
		setShow(false);
		editBoard(newBoardObj);
		navigate(`/dashboard/${newBoardObj.id}`);
	}
	return (
		<div className="no_boards">
			<p className="no_boards__title">
				Looks like you don't have any boards. <br /> Use this handy
				button to make one.
			</p>
			<Btn
				content="Add Board"
				extraClasses="sidebar__btn"
				onClick={() => setShow(true)}
			/>
			<Modal
				type="newBoard"
				show={show}
				onClose={() => setShow(false)}
				onSave={onSave}
				boards={boards}
			/>
		</div>
	);
}

export default NoBoards;
