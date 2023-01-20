import React, { useContext, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Popover } from "react-tiny-popover";

import { useAuthState, useSignOut } from "react-firebase-hooks/auth";
import { auth } from "../../../firebase";

import "./Sidebar.css";

import Btn from "../../blocks/Btn/Btn";
import Modal from "../../blocks/Modal/Modal";
import Loading from "../Loading/Loading";

import DatabaseContext from "../../../contexts/DatabaseContext";

function Sidebar({ user, func }) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const context = useContext(DatabaseContext);
  const { dbResults, editBoard } = context;
  const boards = dbResults.boards;
  const { boardId } = useParams();
  const setShow = func;

  console.log(popoverOpen);

  let navigate = useNavigate();

  // const [user, loading, error] = useAuthState(auth);
  const [signOut, soLoading] = useSignOut(auth);

  if (soLoading) {
    return <Loading />;
  }

  if (!user) {
    navigate("/login");
  }

  console.log(user);

  const signMeOut = async () => {
    const success = await signOut();
    if (success) {
      navigate("/login");
    }
  };

  // function onSave(newBoardObj) {
  //   setShow(false);
  //   editBoard(newBoardObj);
  //   navigate(`/dashboard/${newBoardObj.id}`);
  // }

  if (boards.length === 0) {
    return (
      <div className="sidebar">
        <div className="sidebar__top">
          <h2 className="sidebar__title">Boards</h2>
          <ul className="sidebar__list">
            <li className="sidebar__item">There are no Boards</li>
          </ul>
        </div>
        <div className="sidebar__bottom">
          <Btn
            content="Add Board"
            extraClasses="sidebar__btn"
            onClick={() => setShow(true)}
          />
          <div className="sidebar__bottom__user" onClick={() => signMeOut()}>
            <span className="material-symbols-outlined">account_circle</span>
            {user.user.displayName}
          </div>
        </div>
        {/* <Modal
					type="newBoard"
					show={show}
					onClose={() => setShow(false)}
					onSave={onSave}
					boards={boards}
				/> */}
      </div>
    );
  }

  return (
    <div className="sidebar">
      <div className="sidebar__top">
        <h2 className="sidebar__title">Boards</h2>
        <ul className="sidebar__list">
          {boards
            .slice(0)
            .reverse()
            .map((board, index) => (
              <li
                key={index}
                className={
                  boardId === board.id
                    ? "sidebar__item--selected"
                    : "sidebar__item"
                }
              >
                <Link to={`/dashboard/${board.id}`}>{board.title}</Link>
              </li>
            ))}
        </ul>
      </div>
      <div className="sidebar__bottom">
        <Btn
          content="Add Board"
          extraClasses="sidebar__btn"
          onClick={() => setShow(true)}
        />
        <Popover
          isOpen={popoverOpen}
          positions={["top", "right"]}
          onClickOutside={() => setPopoverOpen(false)}
          content={
            <div className="sidebar__popover">
              <div onClick={() => signMeOut()} className="popover__signout">
                <span class="material-symbols-outlined">logout</span>
                Sign Out
              </div>
            </div>
          }
        >
          <div
            className="sidebar__bottom__user"
            onClick={() => setPopoverOpen(!popoverOpen)}
          >
            <span className="material-symbols-outlined">account_circle</span>
            {user.displayName}
          </div>
        </Popover>
      </div>
      {/* <Modal
				type="newBoard"
				show={show}
				onClose={() => setShow(false)}
				onSave={onSave}
				boards={boards}
			/> */}
    </div>
  );
}

export default Sidebar;
