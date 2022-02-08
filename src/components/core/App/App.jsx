import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import axios from "axios";

import BaseLayout from "../BaseLayout/BaseLayout";
import DatabaseContext from "../../../contexts/DatabaseContext";

let dbResults = {};

function App() {
	const [loading, setLoading] = useState(true);

	const editBoard = (newBoard) => {
		console.log("UPDATE BOARD: ", newBoard);
		let newIndex;
		const newBoardIndex = dbResults.boards.findIndex(
			(i) => i.id === newBoard.id
		);
		if (newBoardIndex === -1) {
			newIndex = dbResults.boards.length;
		} else {
			newIndex = newBoardIndex;
		}
		dbResults.boards[newIndex] = newBoard;

		//For new boards
		if (newBoard.index === dbResults.numOfBoards) {
			dbResults.numOfBoards++;

			fetch(`${process.env.REACT_APP_API_URL}/new/board`, {
				method: "POST",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json"
				},
				body: JSON.stringify(newBoard)
			})
				.then((res) => {
					console.log(res);
					// reloadDb();
				})
				.catch((err) => {
					console.log(err);
				});
		} else {
			fetch(`${process.env.REACT_APP_API_URL}/update/board`, {
				method: "POST",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json"
				},
				body: JSON.stringify(newBoard)
			})
				.then((res) => {
					console.log(res);
				})
				.catch((err) => {
					console.log(err);
				});
		}
	};

	const deleteBoard = (board) => {
		console.log("DELETE BOARD: ", board);

		let boards = dbResults.boards;

		boards.splice(dbResults.indexOf(board), 1);

		fetch(`${process.env.REACT_APP_API_URL}/board`, {
			method: "DELETE",
			headers: {
				"Accept": "application/json",
				"Content-Type": "application/json"
			},
			body: JSON.stringify(board)
		})
			.then((res) => {
				console.log(res);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	useEffect(() => {
		fetch(`${process.env.REACT_APP_API_URL}/boards`)
			.then((res) => {
				res.json().then((json) => {
					dbResults = json;
					setLoading(false);
				});
			})
			.catch((err) => {
				const ers = JSON.stringify(err);
				setLoading(false);
			});
	}, []);
	const boards = dbResults.boards;

	//TODO: better loading
	if (loading) {
		return <div>Loading...</div>;
	}

	return (
		<DatabaseContext.Provider value={{ dbResults, editBoard, deleteBoard }}>
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
