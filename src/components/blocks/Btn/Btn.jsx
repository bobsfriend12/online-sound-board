import React from "react";

import "./Btn.css";

function Btn({ content, onClick, extraClasses, ...props }) {
	return (
		<button
			className={extraClasses ? "btn " + extraClasses : "btn"}
			onClick={onClick}
			{...props}
		>
			{content}
		</button>
	);
}

export default Btn;
