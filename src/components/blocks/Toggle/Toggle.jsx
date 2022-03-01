import React from "react";

import "./Toggle.css";

function Toggle({ name, onToggle }) {
	function onClick() {
		const checkbox = document.getElementById(name);
		onToggle(name, checkbox.checked);
	}
	return (
		<label htmlFor={name} className="toggle__label" onClick={onClick}>
			<input
				className="toggle__input"
				type="checkbox"
				name={name}
				id={name}
			/>
			<div className="toggle__switch"></div>
		</label>
	);
}

export default Toggle;
