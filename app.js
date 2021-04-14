//get all the fx-btns and put them in an array
const ids = $(".fx-btn").get();
const audios = $("audio").get();

//loop through each of the buttons
for (let i = 0; i < ids.length; i++) {
	const btn = $(".fx-btn")[i];
	const id = $(".fx-btn")[i].id;
	const selId = $(`#${id}`);

	//set IsPlaying to false for all buttons
	sessionStorage.setItem(`${id}IsPlaying`, "false");

	const state = sessionStorage.getItem(`${id}IsPlaying`);

	//create event listeners for each button
	btn.addEventListener("click", () => {
		const audio = document.getElementById(`${id}Audio`);
		const state = sessionStorage.getItem(`${id}IsPlaying`);

		//if its not playing, play it
		if (state == "false") {
			selId.addClass("playing");
			audio.play();
			sessionStorage.setItem(`${id}IsPlaying`, "true");
		}
		//if its playing pause it and reset it back to the beginning
		else if (state == "true") {
			//remove the playing class
			selId.removeClass("playing");
			audio.pause();
			audio.currentTime = 0;
			sessionStorage.setItem(`${id}IsPlaying`, "false");
		}
	});
}

for (let i = 0; i < audios.length; i++) {
	const aud = audios[i];
	const currAud = $("audio")[i].id;

	aud.addEventListener("ended", () => {
		const aud = audios[i];
		const id = $(".fx-btn")[i].id;

		//remove the playing class
		selId.removeClass("playing");

		//pause the audio
		aud.pause();
		//reset it at the beginning
		aud.currentTime = 0;
		//set IsPlaying to false
		sessionStorage.setItem(`${id}IsPlaying`, "false");
	});
}
