import React, { useState, useEffect } from "react";

function Main() {
	const [loading, setLoading] = useState(true);
	const [content, setContent] = useState("not loaded");

	useEffect(() => {
		fetch(`${process.env.REACT_APP_API_URL}/boards`)
			.then((res) => {
				let data;
				res.json().then((json) => {
					data = json;
					setContent(data);
					setLoading(false);
				});
				// console.log(res.json());
				// setContent(res.json());
				// setLoading(false);
			})
			.catch((err) => {
				const ers = JSON.stringify(err);
				setContent(`${ers}`);
				setLoading(false);
			});
	}, []);

	if (loading === true) {
		return <div>Loading</div>;
	} else {
		return <div>{JSON.stringify(content, null, 2)}</div>;
	}
}

export default Main;
