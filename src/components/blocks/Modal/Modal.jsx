import React from "react";

import EditSound from "./types/EditSound";
import NewSound from "./types/NewSound";
import NewBoard from "./types/NewBoard";

import "./Modal.css";

function Modal({
	type,
	sound,
	show,
	onClose,
	onSave,
	onDelete,
	board,
	boards
}) {
	if (!show) {
		return null;
	}

	if (type === "newBoard") {
		return <NewBoard onClose={onClose} onSave={onSave} boards={boards} />;
	} else if (type === "newSound") {
		return <NewSound onClose={onClose} onSave={onSave} board={board} />;
	} else if (type === "editSound") {
		return (
			<EditSound
				sound={sound}
				onClose={onClose}
				onSave={onSave}
				onDelete={onDelete}
			/>
		);
	} else {
		return null;
	}
}

export default Modal;
