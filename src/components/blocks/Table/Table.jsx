import React, { useState } from "react";
import { reactFormatter, ReactTabulator } from "react-tabulator";

import "./Table.css";
import "react-tabulator/lib/styles.css";
import "./materialize.css";

import Btn from "../Btn/Btn";
import Modal from "../Modal/Modal";

function Table({ edit, setRows, sounds, setSounds }) {
	const [showEdit, setShowEdit] = useState(false);
	const [sound, setSound] = useState({});

	function onDelete() {
		//After we delete 1 sound the index property in the sound
		//object is no longer correct. This mean we have to find
		//its real index in the sounds array.
		let soundsCopy = sounds;
		const index = sounds.findIndex((o) => o.id === sound.id);
		soundsCopy.splice(index, 1);
		setSounds(soundsCopy);
		setShowEdit(false);
	}

	function onEditSave(newSoundObj) {
		let soundsCopy = sounds;
		soundsCopy[sounds.findIndex((o) => o.id === newSoundObj.id)] =
			newSoundObj;
		setSounds(soundsCopy);
		setShowEdit(false);
	}

	//#region
	function EditBtn(props) {
		return (
			<Btn
				content="Edit"
				onClick={() => {
					setSound(props.cell._cell.row.data);
					setShowEdit(true);
				}}
			/>
		);
	}

	let columns;
	if (edit) {
		columns = [
			{ title: "ID", field: "id", headerSort: false },
			{ title: "Name", field: "name", headerSort: false },
			{ title: "Audio File", field: "audioFile", headerSort: false },
			{ title: "Duration", field: "duration", headerSort: false },
			{
				title: "",
				field: "",
				formatter: reactFormatter(<EditBtn />),
				headerSort: false
			}
		];
	} else {
		columns = [
			{ title: "ID", field: "id", headerSort: false },
			{ title: "Name", field: "name", headerSort: false },
			{ title: "Audio File", field: "audioFile", headerSort: false },
			{ title: "Duration", field: "duration", headerSort: false }
		];
	}
	let options;
	if (edit) {
		options = {
			invalidOptionWarnings: false,
			debugInvalidOptions: false,
			movableRows: true
		};
	} else {
		options = {
			invalidOptionWarnings: false,
			debugInvalidOptions: false
		};
	}
	let ref;
	//#endregion
	return (
		<>
			<ReactTabulator
				ref={(r) => {
					ref = r;
					console.log(r);
					let hi;
					setRows !== undefined && r !== null
						? setRows(r)
						: (hi = ref);
				}}
				data={sounds}
				columns={columns}
				layout={"fitColumns"}
				options={options}
			/>
			<Modal
				type="editSound"
				sound={sound}
				show={showEdit}
				onClose={() => setShowEdit(false)}
				onSave={onEditSave}
				onDelete={() => onDelete()}
			/>
		</>
	);
}

export default Table;
