import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import axios from 'axios';

import BaseLayout from "../BaseLayout/BaseLayout";
import DatabaseContext from "../../../contexts/DatabaseContext";

//TODO: get results from db
let dbResults = {
	status: "success",
	numOfBoards: 3,
	boards: [
		{
			index: 0,
			id: "the-radio-play-disaster",
			title: "The Radio Play Disaster",
			numOfSounds: 3,
			sounds: [
				{
					index: 0,
					id: "heat-laser",
					name: "Heat Laser",
					audioFile: "heatlaser.mp3"
				},
				{
					index: 1,
					id: "twinkle-twinkle",
					name: "Twinkle Twinkle Little Star",
					audioFile: "twinkle.mp3"
				},
				{
					index: 2,
					id: "breaking-news",
					name: "Breaking News",
					audioFile: "breakingNews.mp3"
				}
			]
		},
		{
			index: 1,
			id: "the-alibis",
			title: "The Alibis",
			numOfSounds: 3,
			sounds: [
				{
					index: 0,
					id: "floor-boards",
					name: "Creaking Floor Boards",
					audioFile: "floorboards.mp3"
				},
				{
					index: 1,
					id: "mozart",
					name: "mozart",
					audioFile: "mozart.mp3"
				},
				{
					index: 2,
					id: "door-creak",
					name: "Door Creak",
					audioFile: "doorCreak.mp3"
				}
			]
		},
		{
			index: 2,
			id: "the-lion-king-jr",
			title: "The Lion King Jr.",
			numOfSounds: 3,
			sounds: [
				{
					index: 0,
					id: "tune-up",
					name: "Orchestra Tune-Up",
					audioFile: "tuneup.mp3",
					duration: "00:40"
				},
				{
					index: 1,
					id: "circle-of-life",
					name: "Circle of Life",
					audioFile: "circleOfLife.mp3",
					duration: "1:40"
				},
				{
					index: 2,
					id: "into-scars-cave",
					name: "Into Scars Cave",
					audioFile: "intoScarsCave.mp3",
					duration: "4:20"
				}
			]
		}
	]
};

const editBoard = (newBoard) => {
	console.log("UPDATE BOARD: ", newBoard);
	dbResults.boards[newBoard.index] = newBoard;
};
const boards = dbResults.boards;

function App() {
	return (
		<DatabaseContext.Provider value={{ dbResults, editBoard }}>
			<BrowserRouter>
				<Routes>
					<Route path="*" element={<BaseLayout page="notFound" />} />
					<Route
						exact
						path="/"
						element={<BaseLayout page="main" />}
					/>
					<Route
						path="/dashboard"
						element={
							<Navigate
								to={boards[dbResults.numOfBoards - 1].id}
								replace={true}
							/>
						}
					/>
					<Route
						path="/dashboard/:boardId"
						element={<BaseLayout page="dashboard" />}
					/>
					<Route
						path="/edit"
						element={
							<Navigate
								to={
									"/dashboard/" +
									boards[dbResults.numOfBoards - 1].id
								}
								replace={true}
							/>
						}
					/>
					<Route
						path="/edit/:boardId"
						element={<BaseLayout page="edit" />}
					/>
					<Route
						path="/edit/:boardId/:soundId"
						element={<BaseLayout page="edit" />}
					/>
				</Routes>
			</BrowserRouter>
		</DatabaseContext.Provider>
	);
}

export default App;
