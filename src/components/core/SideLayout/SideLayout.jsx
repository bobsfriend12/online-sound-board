import React, { useContext, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../../firebase";

import "./SideLayout.css";

import DatabaseContext from "../../../contexts/DatabaseContext";

import Sidebar from "../Sidebar/Sidebar";
import Dashboard from "../../pages/Dashboard/Dashboard";
import EditBoard from "../../pages/EditBoard/EditBoard";
import Modal from "../../blocks/Modal/Modal";
import Loading from "../Loading/Loading";

function SideLayout(user, currBoard, page) {
  // const [user, loading, error] = useAuthState(auth);
  const [show, setShow] = useState(false);
  const context = useContext(DatabaseContext);
  const { dbResults, editBoard } = context;
  const boards = dbResults.boards;
  const { boardId } = useParams();

  let navigate = useNavigate();

  // if (loading) {
  //   return <Loading />;
  // }
  //Make sure user logged in
  if (!user && page !== "login") {
    navigate("/login");
  }

  function onSave(newBoardObj) {
    setShow(false);
    editBoard(newBoardObj);
    navigate(`/dashboard/${newBoardObj.id}`);
  }

  return (
    <div className="side_layout">
      <div className="side_layout__sidebar">
        <Sidebar user={user} func={setShow} />
      </div>
      <div className="side_layout__main">
        {page === "dashboard" ? (
          <>
            <Dashboard board={currBoard} />
            <Modal
              type="newBoard"
              show={show}
              onClose={() => setShow(false)}
              onSave={onSave}
              boards={boards}
            />
          </>
        ) : (
          <EditBoard board={currBoard} />
        )}
      </div>
    </div>
  );
}

export default SideLayout;
