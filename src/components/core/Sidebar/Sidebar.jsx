import React, { useContext, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

import "./Sidebar.css";

import Btn from "../../blocks/Btn/Btn";
import Modal from "../../blocks/Modal/Modal";

import DatabaseContext from "../../../contexts/DatabaseContext";

function Sidebar() {
	const [show, setShow] = useState(false);
	const context = useContext(DatabaseContext);
	const { dbResults, editBoard } = context;
	const boards = dbResults.boards;
	console.log(boards);
	const { boardId } = useParams();

	let navigate = useNavigate();

	function onSave(newBoardObj) {
		setShow(false);
		editBoard(newBoardObj);
		navigate(`/dashboard/${newBoardObj.id}`);
	}

	if (boards.length === 0) {
		return (
			<div className="sidebar">
				<div className="sidebar__top">
					<h2 className="sidebar__title">Boards</h2>
					<ul className="sidebar__list">
						<li className="sidebar__item">There are no Boards</li>
					</ul>
				</div>
				<div className="sidebar__bottom">
					<Btn
						content="Add Board"
						extraClasses="sidebar__btn"
						onClick={() => setShow(true)}
					/>
				</div>
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

	return (
		<div className="sidebar">
			<div className="sidebar__top">
				<h2 className="sidebar__title">Boards</h2>
				<ul className="sidebar__list">
					{boards
						.slice(0)
						.reverse()
						.map((board, index) => (
							<li
								key={index}
								className={
									boardId === board.id
										? "sidebar__item--selected"
										: "sidebar__item"
								}
							>
								<Link to={`/dashboard/${board.id}`}>
									{board.title}
								</Link>
							</li>
						))}
				</ul>
			</div>
			<div className="sidebar__bottom">
				<Btn
					content="Add Board"
					extraClasses="sidebar__btn"
					onClick={() => setShow(true)}
				/>
			</div>
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

export default Sidebar;
