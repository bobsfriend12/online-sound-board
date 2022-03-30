import React from "react";

import Btn from "../../Btn/Btn";

function NewBoard({ onClose, onSave, boards }) {
	let title;

	const tryNewId = (id) => {
		if (boards.find((board) => board.id === id)) {
			return true;
		} else {
			return false;
		}
	};

	const returnUniqueId = (id) => {
		let tries = 1;
		let isUnique = false;

		while (!isUnique) {
			if (tryNewId(id)) {
				id = id + "-" + tries;
				tries++;
			} else {
				isUnique = true;
			}
		}
		return id;
	};

	function handleSave() {
		let newBoardObj = {};
		//First replace changes all special characters (not a-z 0-9)
		//with nothing to prevent url conflicts
		//Second replace changes all spaces (or any whitespace) with a
		//a dash(-) to improve readability
		//Third make sure it's not duplicate
		newBoardObj.id = returnUniqueId(
			title
				.replace(/[^a-zA-Z0-9 ]/g, "")
				.replace(/ +/g, "-")
				.toLowerCase()
		);
		newBoardObj.title = title;
		newBoardObj.numOfSounds = 0;
		newBoardObj.sounds = [];
		console.log(newBoardObj);
		onSave(newBoardObj);
	}

	return (
		<div className="modal" onClick={onClose}>
			<div className="modal_content" onClick={(e) => e.stopPropagation()}>
				<div className="modal__header">Create New Board</div>
				<div className="modal__body">
					<div className="inputs">
						<div className="id_wrapper input_wrapper">
							<div className="title_wrapper input_wrapper">
								<label
									htmlFor="sound-title"
									className="title__label"
								>
									Name:<br></br>
								</label>
								<input
									type="text"
									className="title__input"
									id="board-title"
									onChange={(e) => (title = e.target.value)}
									required
								/>
							</div>
						</div>
					</div>
				</div>
				<div className="modal__footer">
					<Btn
						content="Cancel"
						extraClasses="modal__btn"
						onClick={onClose}
					/>
					<Btn
						content="Save"
						extraClasses="modal__btn"
						onClick={handleSave}
					/>
				</div>
			</div>
		</div>
	);
}

export default NewBoard;
