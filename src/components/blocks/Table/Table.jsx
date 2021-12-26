import React, { useContext } from "react";
import { useParams } from "react-router-dom";

import "./Table.css";
import "react-tabulator/lib/styles.css";
import "react-tabulator/css/materialize/tabulator_materialize.min.css";

import DatabaseContext from "../../../contexts/DatabaseContext";
import { ReactTabulator } from "react-tabulator";

function Table() {
	const dbResults = useContext(DatabaseContext);
	const { boardId } = useParams();
	const currBoard = dbResults.boards.find((o) => o.id === boardId);
	const sounds = currBoard.sounds;

	const columns = [
		{ title: "ID", field: "id" },
		{ title: "Name", field: "name" },
		{ title: "Audio File", field: "audioFile" },
		{ title: "Duration", field: "duration" }
	];

	return (
		<ReactTabulator data={sounds} columns={columns} layout={"fitData"} />
	);
}

export default Table;
