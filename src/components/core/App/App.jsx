import React, { useState, useEffect } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  Navigate,
  useNavigate,
} from "react-router-dom";

import { useAuthState, useIdToken } from "react-firebase-hooks/auth";
import { auth } from "../../../firebase";

import BaseLayout from "../BaseLayout/BaseLayout";
import Loading from "../Loading/Loading";
import Error from "../Error/Error";
import DatabaseContext from "../../../contexts/DatabaseContext";
import Login from "../../pages/Login/Login";

let dbResults = {};

function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  //If this is true then we need to redirect to login
  const [login, setLogin] = useState(false);
  // const [user, loadingUser, errorUser] = useAuthState(auth);
  const [user, loadingUser, errorUser] = useIdToken(auth);

  const editBoard = (newBoard) => {
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
    if (newIndex === dbResults.numOfBoards) {
      dbResults.numOfBoards++;

      fetch(`${process.env.REACT_APP_API_URL}/new/board`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.accessToken}`,
        },
        body: JSON.stringify(newBoard),
      })
        .then(() => {
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
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.accessToken}`,
        },
        body: JSON.stringify(newBoard),
      })
        .then(() => {})
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const deleteBoard = (board) => {
    let boards = dbResults.boards;

    boards.splice(boards.indexOf(board), 1);

    fetch(`${process.env.REACT_APP_API_URL}/board`, {
      method: "DELETE",
      mode: "cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.accessToken}`,
      },
      body: JSON.stringify(board),
    })
      .then(() => {
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    console.log(process.env.REACT_APP_API_URL);
    if (user !== undefined && user !== null) {
      fetch(`${process.env.REACT_APP_API_URL}/boards`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      })
        .then((res) => {
          res.json().then((json) => {
            dbResults = json;
            setLogin(false);
            setLoading(false);
          });
        })
        .catch((err) => {
          //TODO: Handle error
          console.log(err);
          setError(true);
          setLogin(false);
          setLoading(false);
        });
    } else {
      setLogin(true);
      setLoading(false);
    }
  }, [user]);
  const boards = dbResults.boards;

  if (loading || loadingUser) {
    return <Loading />;
  }

  if (error || errorUser) {
    return <Error />;
  }

  let boardToRedirect;

  //We need this up here because the boards won't be defined
  //if the user is not logged in. This is a hacky solution
  if (login) {
    return (
      <DatabaseContext.Provider value={{ dbResults, editBoard, deleteBoard }}>
        <BrowserRouter>
          <Routes>
            <Route path="*" element={<Navigate to="/login" replace={true} />} />
            <Route path="/login" element={<BaseLayout page="login" />} />
          </Routes>
        </BrowserRouter>
      </DatabaseContext.Provider>
    );
  }
  if (boards.length > 0) {
    boardToRedirect = boards[dbResults.numOfBoards - 1].id;
  } else {
    boardToRedirect = "no-boards";
  }

  return (
    <DatabaseContext.Provider value={{ dbResults, editBoard, deleteBoard }}>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<BaseLayout page="notFound" />} />
          <Route exact path="/" element={<BaseLayout page="main" />} />
          <Route path="/login" element={<BaseLayout page="login" />} />
          <Route
            path="/dashboard"
            element={<Navigate to={boardToRedirect} replace={true} />}
          />
          <Route
            path="/dashboard/:boardId"
            element={<BaseLayout user={user} page="dashboard" />}
          />
          <Route
            path="/edit"
            element={
              <Navigate to={"/dashboard/" + boardToRedirect} replace={true} />
            }
          />
          <Route
            path="/edit/:boardId"
            element={<BaseLayout user={user} page="edit" />}
          />
          <Route
            path="/edit/:boardId/:soundId"
            element={<BaseLayout user={user} page="edit" />}
          />
          <Route
            path="/board/:boardId"
            element={<BaseLayout user={user} page="board" />}
          />
          <Route path="/loading" element={<Loading />} />
        </Routes>
      </BrowserRouter>
    </DatabaseContext.Provider>
  );
}

export default App;
