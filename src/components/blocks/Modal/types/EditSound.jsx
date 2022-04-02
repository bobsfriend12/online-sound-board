import React, { useState } from "react";

import Btn from "../../Btn/Btn";

function EditSound({ sound, onClose, onSave, onDelete }) {
	const [noAudio, setNoAudio] = useState(false);
	const [noTitle, setNoTitle] = useState(false);
	const [saving, setSaving] = useState(false);
	let title = sound.name,
		audioName,
		audioDuration,
		files;

	function handleSave() {
		setNoAudio(false);
		setNoTitle(false);
		if (audioName && title !== "") {
			setSaving(true);

			const audioExtension = audioName.split(".").pop();
			const uuid = sound.audioFile.split(".")[0];

			let newSoundObj = {};
			newSoundObj.index = sound.index;
			newSoundObj.id = sound.id;
			newSoundObj.name = title;
			newSoundObj.audioFile = `${uuid}.${audioExtension}`;
			newSoundObj.duration = audioDuration;

			const formData = new FormData();
			formData.append("audio", files[0]);
			formData.append("id", uuid);
			formData.append("fileExtension", audioExtension);

			fetch(`${process.env.REACT_APP_API_URL}/upload`, {
				method: "POST",
				body: formData
			});
			onSave(newSoundObj);
			setSaving(false);
		} else if (!audioName && title !== "") {
			let newSoundObj = {};
			newSoundObj.index = sound.index;
			newSoundObj.id = sound.id;
			newSoundObj.name = title;
			newSoundObj.audioFile = sound.audioFile;
			newSoundObj.duration = sound.duration;
			onSave(newSoundObj);
		} else if (!audioName && title === "") {
			setNoAudio(true);
			setNoTitle(true);
		} else if (!audioName) {
			setNoAudio(true);
		} else if (title === "") {
			setNoTitle(true);
		}
	}

	function handleFiles(e) {
		files = e.target.files;
		document
			.querySelector("#src")
			.setAttribute("src", URL.createObjectURL(files[0]));
		document.querySelector("#file-preview").load();
		audioName = e.target.files[0].name;
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
				<div className="modal__header">Edit: {sound.name}</div>
				<div className="modal__body">
					<div className="inputs">
						<div className="id_wrapper input_wrapper">
							<label htmlFor="sound-id" className="id__label">
								ID:
							</label>
							<p className="input__description">
								This is used to identify the sound in the
								system. This will matter in a future update
								(wink wink).
							</p>
							<input
								type="text"
								className="id__input"
								id="sound-id"
								defaultValue={sound.id}
								disabled
							/>
						</div>
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
							{noTitle ? (
								<p className="input__error">
									Please input a title
								</p>
							) : (
								<></>
							)}
							<input
								type="text"
								className="title__input"
								id="sound-title"
								defaultValue={sound.name}
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
								board. If you don't wan't to change it, just
								leave it blank.
							</p>
							{noAudio ? (
								<p className="input__error">
									Please upload an audio file
								</p>
							) : (
								<></>
							)}
							<input
								type="file"
								className="file__input"
								id="sound-file"
								accept="audio/*"
								onChange={handleFiles}
							/>
							<p className="file__preview">Preview:</p>
							{/*TODO: Fetch file from server*/}
							<audio
								id="file-preview"
								controls
								onLoadedMetadata={getDuration}
							>
								<source
									src={`${process.env.REACT_APP_API_URL}/file/${sound.audioFile}`}
									id="src"
								/>
							</audio>
						</div>
					</div>
				</div>
				<div className="modal__footer">
					<Btn
						content="Delete"
						extraClasses="modal__btn"
						onClick={onDelete}
					/>
					<Btn
						content="Cancel"
						extraClasses="modal__btn"
						onClick={onClose}
					/>
					<Btn
						content={saving ? "Saving" : "Save"}
						extraClasses="modal__btn"
						onClick={handleSave}
					/>
				</div>
			</div>
		</div>
	);
}

export default EditSound;
