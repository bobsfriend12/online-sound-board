import React from "react";

import Btn from "../../Btn/Btn";

function NewSound({ sound, onClose, onSave }) {
	console.log("Modal type is newSound");
	console.log(sound);
	let title, audioName, audioDuration;

	function handleSave() {
		let newSoundObj = {};
		//See sidebar comp for details on this
		const id = title
			.replace(/[^a-zA-Z0-9 ]/g, "")
			.replace(/ +/g, "-")
			.toLowerCase();
		newSoundObj.id = id;
		newSoundObj.name = title;
		newSoundObj.audioFile = audioName;
		newSoundObj.duration = audioDuration;
		console.log(newSoundObj);
		onSave(newSoundObj);
	}

	function handleFiles(e) {
		let files = e.target.files;
		document
			.querySelector("#src")
			.setAttribute("src", URL.createObjectURL(files[0]));
		document.querySelector("#file-preview").load();
		audioName = e.target.files[0].name;
		console.log(audioName);
	}

	function convertHMS(value) {
		const sec = parseInt(value, 10); // convert value to number if it's string
		let hours = Math.floor(sec / 3600); // get hours
		let minutes = Math.floor((sec - hours * 3600) / 60); // get minutes
		let seconds = sec - hours * 3600 - minutes * 60; //  get seconds
		// add 0 if value < 10; Example: 2 => 02
		if (hours < 10) {
			hours = "0" + hours;
		}
		if (minutes < 10) {
			minutes = "0" + minutes;
		}
		if (seconds < 10) {
			seconds = "0" + seconds;
		}
		return hours + ":" + minutes + ":" + seconds; // Return is HH : MM : SS
	}

	function getDuration() {
		audioDuration = convertHMS(
			document.querySelector("#file-preview").duration
		);
	}

	return (
		<div className="modal" onClick={onClose}>
			<div className="modal_content" onClick={(e) => e.stopPropagation()}>
				<div className="modal__header">New Sound</div>
				<div className="modal__body">
					<div className="inputs">
						<div className="title_wrapper input_wrapper">
							<label
								htmlFor="sound-title"
								className="title__label"
							>
								Name:
							</label>
							<p className="input__description">
								This is used as the name for the sound when you
								launch the board. Make this whatever you want.
							</p>
							<input
								type="text"
								className="title__input"
								id="sound-title"
								onChange={(e) => (title = e.target.value)}
								required
							/>
						</div>
						<div className="file_wrapper input_wrapper">
							<label
								htmlFor="sound-file"
								className="sound__label"
							>
								File:
							</label>
							<p className="input__description">
								This is the audio file that is uploaded to the
								server, so that you play it when you launch a
								board.
							</p>
							<input
								type="file"
								className="file__input"
								id="sound-file"
								accept="audio/*"
								onChange={handleFiles}
								required
							/>
							<p className="file__preview">Preview:</p>
							<audio
								id="file-preview"
								controls
								onLoadedMetadata={getDuration}
							>
								<source src="" id="src" />
							</audio>
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

export default NewSound;
