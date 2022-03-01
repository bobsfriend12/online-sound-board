import React from "react";
import { useContext, useState, useEffect } from "react";

import "./SoundGrid.css";

function SoundBtn({ sound, onToggle, playing }) {
	return (
		<p
			className={
				playing[sound.id]
					? "sound_grid__item sound_grid__item--playing"
					: "sound_grid__item"
			}
			onClick={() => {
				onToggle(sound.id);
			}}
		>
			{sound.name}
		</p>
	);
}

function SoundGrid({ board, onToggle, playing, ...props }) {
	return (
		<div className="sound_grid">
			{board.sounds.map((sound) => {
				return (
					<SoundBtn
						key={sound.id}
						sound={sound}
						onToggle={onToggle}
						playing={playing}
					/>
				);
			})}
		</div>
	);
}

export default SoundGrid;
