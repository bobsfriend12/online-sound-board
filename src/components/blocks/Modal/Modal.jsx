import React from "react";

import EditSound from "./types/EditSound";
import NewSound from "./types/NewSound";
import NewBoard from "./types/NewBoard";

import "./Modal.css";

function Modal({ type, sound, show, onClose, onSave, onDelete }) {
	if (!show) {
		return null;
	}

	if (type === "newBoard") {
		return <NewBoard onClose={onClose} onSave={onSave} />;
	} else if (type === "newSound") {
		return <NewSound onClose={onClose} onSave={onSave} />;
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
		console.log("No modal type");
		return null;
	}
}

export default Modal;
