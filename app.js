//get all the fx-btns and put them in an array
const ids = $(".fx-btn").get();
const audios = $("audio").get();

sessionStorage.setItem("randomAudTarget", "null");

//loop through each of the buttons
for (let i = 0; i < ids.length; i++) {
	const id = $(".fx-btn")[i].id;

	//set IsPlaying to false for all buttons
	sessionStorage.setItem(`${id}IsPlaying`, "false");
}

$(".board-container").on("click", e => {
	let target = e.target.id;
	let audTarget;

	if (target === "random") {
		if (sessionStorage.getItem("randomAudTarget") != "null") {
			audTarget = sessionStorage.getItem("randomAudTarget");
			sessionStorage.setItem("randomAudTarget", "null");
		} else {
			const ran = Math.floor(Math.random() * 27);
			audTarget = ids[ran].id;
			sessionStorage.setItem("randomAudTarget", audTarget);
		}
	} else {
		audTarget = target;
	}

	const audio = document.getElementById(`${audTarget}Audio`);
	const state = sessionStorage.getItem(`${target}IsPlaying`);
	const selId = $(`#${target}`);

	if (target === "faintScreams") {
		audio.volume = 0.115;
	} else if (target === "static") {
		audio.volume = 0.5;
	}

	//if its not playing, play it
	if (state == "false") {
		selId.addClass("playing");
		audio.play();
		sessionStorage.setItem(`${target}IsPlaying`, "true");
	}
	//if its playing pause it and reset it back to the beginning
	else if (state == "true") {
		//remove the playing class
		selId.removeClass("playing");
		audio.pause();
		audio.currentTime = 0;
		sessionStorage.setItem(`${target}IsPlaying`, "false");
	}
});

for (let i = 0; i < audios.length; i++) {
	const aud = audios[i];

	aud.addEventListener("ended", () => {
		let aud = audios[i];
		let audId = aud.id;
		let id = audId.slice(0, -5);
		let ranStor = sessionStorage.getItem("randomAudTarget");
		let selId = $(`#${id}`);
		let btnId = id;

		if (id === ranStor) {
			btnId = "random";
			aud = document.getElementById(`${ranStor}Audio`);
			audId = `${ranStor}Audio`;
			id = ranStor;
			selId = $("#random");

			sessionStorage.setItem("randomAudTarget", "null");
		}

		console.log(aud);
		console.log(audId);
		console.log(id);

		console.log(selId);

		//remove the playing class
		selId.removeClass("playing");

		//pause the audio
		aud.pause();
		//reset it at the beginning
		aud.currentTime = 0;
		//set IsPlaying to false
		sessionStorage.setItem(`${btnId}IsPlaying`, "false");
	});
}
