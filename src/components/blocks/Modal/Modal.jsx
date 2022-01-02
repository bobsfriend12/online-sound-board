import React from "react";

import Btn from "../Btn/Btn";
import EditSound from "./types/EditSound";
import NewSound from "./types/NewSound";

import "./Modal.css";

function Modal({ type, sound, show, onClose, onSave, onDelete }) {
	if (!show) {
		return null;
	}

	if (type === "newBoard") {
		console.log("Modal type is newBoard");
		return null;
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
