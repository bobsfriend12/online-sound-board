import React from "react";
import { useContext, useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

import "./Board.css";

import DatabaseContext from "../../../contexts/DatabaseContext";
import SoundGrid from "../../blocks/SoundGrid/SoundGrid";
import Btn from "../../blocks/Btn/Btn";

function Board() {
	const { dbResults } = useContext(DatabaseContext);
	const { boardId } = useParams();
	const board = dbResults.boards.find((o) => o.id === boardId);

	const [playing, setPlaying] = useState({});

	let audios = {};

	useEffect(() => {
		if (board) {
			board.sounds.forEach((sound) => {
				console.log(sound);
				const url = `${process.env.REACT_APP_API_URL}/file/${sound.audioFile}`;
				//I tried doing this in it's own object
				//but it didn't work. Thats why it's in window.
				window[sound.id] = new Audio(url);
				window[sound.id].addEventListener("ended", () => {
					setPlaying({ ...playing, [sound.id]: false });
				});
			});
		}
	}, []);

	function toggleAudio(id) {
		console.log(id);
		console.log(playing);
		if (playing[id]) {
			console.log(`${id} is playing, pausing now`);
			window[id].pause();
			setPlaying({ ...playing, [id]: false });
		} else if (!playing[id]) {
			console.log(`${id} is paused, playing now`);
			console.log(window[id]);
			window[id].play();
			setPlaying({ ...playing, [id]: true });
		}
	}

	return (
		<div className="board">
			<div className="board__top">
				<div className="board__top__left">
					<p className="board__top__btns__back" title="Back">
						<Link to={`/dashboard/${board.id}`}>&#129092;</Link>
					</p>
				</div>
				<h1 className="board__title">{board.title}</h1>
				<div className="board__top__right">
					<p className="board__top__btns__settings" title="Settings">
						&#9881;
					</p>
				</div>
			</div>
			<div className="board__grid">
				<SoundGrid board={board} onToggle={toggleAudio} />
			</div>
			<div className="board__audio_container">
				{/* {board.sounds.map((sound) => {
					return (
						<audio
							key={sound.id}
							src={`${process.env.REACT_APP_API_URL}/file/${sound.audioFile}`}
							className="board__audio"
							controls
						/>
					);
				})} */}
			</div>
		</div>
	);
}

export default Board;
