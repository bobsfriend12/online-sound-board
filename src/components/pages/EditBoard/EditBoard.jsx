import React, { useContext, useState, useEffect } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import { reactFormatter, ReactTabulator } from "react-tabulator";

import "./EditBoard.css";
import "react-tabulator/lib/styles.css";
import "../../blocks/Table/materialize.css";

import Btn from "../../blocks/Btn/Btn";
import Modal from "../../blocks/Modal/Modal";

import DatabaseContext from "../../../contexts/DatabaseContext";

function EditBoard({ board }) {
	const [title, setTitle] = useState();
	const [showNew, setShowNew] = useState(false);
	const [r, setRows] = useState([]);
	const { editBoard, deleteBoard } = useContext(DatabaseContext);

	const { dbResults } = useContext(DatabaseContext);
	const { boardId } = useParams();
	const currBoard = dbResults.boards.find((o) => o.id === boardId);

	const [showEdit, setShowEdit] = useState(false);
	const [sound, setSound] = useState({});

	useEffect(() => {
		if (board !== undefined) {
			setTitle(board.title);
		}
	}, []);

	let navigate = useNavigate();
	if (board === undefined) {
		return <Navigate to="/dashboard" />;
	}
	const sounds = currBoard.sounds;
	function onDelete() {
		//After we delete 1 sound the index property in the sound
		//object is no longer correct. This mean we have to find
		//its real index in the sounds array.
		const index = sounds.findIndex((o) => o.id === sound.id);
		sounds.splice(index, 1);
		setShowEdit(false);
	}

	function onEditSave(newSoundObj) {
		sounds[sounds.findIndex((o) => o.id === newSoundObj.id)] = newSoundObj;
		setShowEdit(false);
	}

	function onNewSave(newSoundsObj) {
		newSoundsObj.index = sounds.length;
		sounds.push(newSoundsObj);
		setShowNew(false);
	}

	function onBoardDelete() {
		const confirm = window.confirm(
			"Are you sure you want to delete this board?"
		);
		if (confirm) {
			deleteBoard(board);
			navigate("/dashboard");
		}
	}

	function EditBtn(props) {
		const id = props.cell._cell.row.data.id;
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

	let columns = [
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

	let options = {
		invalidOptionWarnings: false,
		debugInvalidOptions: false,
		movableRows: true
	};
	let ref;

	//If the board is not found, redirect to the dashboard
	//Have to put all the other crap before because react complains
	//That hooks are being used conditionally
	const SaveChanges = () => {
		let newBoard = {
			_id: board._id,
			_rev: board._rev,
		};
		//See sidebar comp for details on this
		newBoard.id = title
			.replace(/[^a-zA-Z0-9 ]/g, "")
			.replace(/ +/g, "-")
			.toLowerCase();
		newBoard.title = title;
		// newBoard.sounds = board.sounds;
		const currSounds = r.table.getData();
		let newSounds = [];
		for (let i = 0; i < currSounds.length; i++) {
			const s = currSounds[i];
			s.index = i;
			newSounds.push(s);
		}
		newBoard.sounds = newSounds;
		editBoard(newBoard);
		navigate(`/dashboard/${newBoard.id}`);
	};

	return (
		<div className="edit">
			<div className="edit__top">
				<h1 className="edit__title">{board.title}</h1>
				<div className="edit__right">
					<Btn content="Delete" onClick={onBoardDelete} />
					<Btn content="Save" onClick={SaveChanges} />
				</div>
			</div>
			<div className="edit__bottom">
				<div className="edit__edit_title_wrapper">
					<label htmlFor="edit_title">Title:</label>
					<input
						type="text"
						className="edit__edit_title"
						id="edit_title"
						defaultValue={title}
						onChange={(e) => setTitle(e.target.value)}
					/>
				</div>
				<div className="edit__edit_sounds_wrapper">
					<div className="edit__edit_sounds_top">
						<h2 className="edit__edit_sounds_title">Sounds</h2>
						<div className="edit__right">
							<Btn
								content="New Sound"
								onClick={() => setShowNew(true)}
							/>
						</div>
					</div>
					{/* <Table
						edit={true}
						setRows={setRows}
						sounds={sounds}
						setSounds={setSounds}
					/> */}
					<ReactTabulator
						ref={(r) => {
							ref = r;
							let hi;
							setRows !== undefined && r !== null
								? setRows(r)
								: (hi = null);
						}}
						data={sounds}
						columns={columns}
						layout={"fitColumns"}
						options={options}
					/>
					<Modal
						type="newSound"
						show={showNew}
						onClose={() => setShowNew(false)}
						onSave={onNewSave}
					/>
					<Modal
						type="editSound"
						sound={sound}
						show={showEdit}
						onClose={() => setShowEdit(false)}
						onSave={onEditSave}
						onDelete={() => onDelete()}
					/>
				</div>
			</div>
		</div>
	);
}

export default EditBoard;
