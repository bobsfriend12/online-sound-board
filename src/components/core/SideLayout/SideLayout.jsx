import React, { useContext, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import "./SideLayout.css";

import DatabaseContext from "../../../contexts/DatabaseContext";

import Sidebar from "../Sidebar/Sidebar";
import Dashboard from "../../pages/Dashboard/Dashboard";
import EditBoard from "../../pages/EditBoard/EditBoard";
import Modal from "../../blocks/Modal/Modal";

function SideLayout(currBoard, page) {
  const [show, setShow] = useState(false);
  const context = useContext(DatabaseContext);
  const { dbResults, editBoard } = context;
  const boards = dbResults.boards;
  const { boardId } = useParams();

  let navigate = useNavigate();

  function onSave(newBoardObj) {
    setShow(false);
    editBoard(newBoardObj);
    navigate(`/dashboard/${newBoardObj.id}`);
  }

  return (
    <div className="side_layout">
      <div className="side_layout__sidebar">
        <Sidebar func={setShow} />
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
