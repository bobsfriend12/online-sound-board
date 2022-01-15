import React, {useState, useEffect} from "react";

import axios from "axios";



function Main() {
	const [loading, setloading] = useState(true);
	const [content, setContent] = useState("not loaded");

	useEffect(() => {
	axios(`${process.env.REACT_APP_API_URL}/boards`).then((res) => {
		const ret = JSON.stringify(res);
		setContent(ret);
		setloading(false);
	}).catch((err) => {
		const ers = JSON.stringify(err);
		setContent(`${ers}`);
		setloading(false);
	});
}, []);
	if(loading === true) {
		return<div>Loading</div>
	} else{
		return <div>{content}</div>
	}
}

export default Main;
