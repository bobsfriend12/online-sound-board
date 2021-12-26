import React, { useContext } from "react";
import { Link, useParams } from "react-router-dom";

import "./Sidebar.css";

import Btn from "../../blocks/Btn/Btn";

import DatabaseContext from "../../../contexts/DatabaseContext";

function Sidebar() {
	const boards = useContext(DatabaseContext).boards;
	const { boardId } = useParams();
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
				<Btn content="Add Board" extraClasses="sidebar__btn" />
			</div>
		</div>
	);
}

export default Sidebar;
