import React from "react";
import { useContext, useState, useEffect } from "react";

import "./SoundGrid.css";

function SoundBtn({ sound, onToggle }) {
	return (
		<p
			className="sound_grid__item"
			onClick={() => {
				onToggle(sound.id);
			}}
		>
			{sound.name}
		</p>
	);
}

function SoundGrid({ board, onToggle, ...props }) {
	return (
		<div className="sound_grid">
			{board.sounds.map((sound) => {
				return (
					<SoundBtn
						key={sound.id}
						sound={sound}
						onToggle={onToggle}
					/>
				);
			})}
		</div>
	);
}

export default SoundGrid;
