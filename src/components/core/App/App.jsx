import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import axios from "axios";

import BaseLayout from "../BaseLayout/BaseLayout";
import DatabaseContext from "../../../contexts/DatabaseContext";

let dbResults = {};

function App() {
	const [loading, setLoading] = useState(true);

	const reloadDb = () => {
		fetch(`${process.env.REACT_APP_API_URL}/boards`)
			.then((res) => {
				let data;
				res.json().then((json) => {
					data = json;
					dbResults = data;
					setLoading(false);
				});
				// console.log(res.json());
				// setContent(res.json());
				// setLoading(false);
			})
			.catch((err) => {
				const ers = JSON.stringify(err);
				// setContent(`${ers}`);
				// setLoading(false);
			});
	};

	const editBoard = (newBoard) => {
		console.log("UPDATE BOARD: ", newBoard);
		dbResults.boards[newBoard.index] = newBoard;

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
