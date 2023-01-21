import React from "react";
import { useContext, useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";

import "./Board.css";

import DatabaseContext from "../../../contexts/DatabaseContext";
import SoundGrid from "../../blocks/SoundGrid/SoundGrid";
import AudioPlayer from "../../blocks/AudioPlayer/AudioPlayer";

function Board() {
  const { dbResults } = useContext(DatabaseContext);
  const { boardId } = useParams();
  const board = dbResults.boards.find((o) => o.id === boardId);

  //We need the refs here so that we can get
  //updated values in the useEffect event listeners.
  const [_playing, _setPlaying] = useState({});
  const playingRef = useRef(_playing);
  const playing = playingRef.current;
  console.log(playingRef);

  const setPlaying = (data) => {
    playingRef.current = data;
    _setPlaying(data);
  };

  //Only used if audioPlayer is enabled
  //Need it to pass to the audio player
  //to know what the properties are.
  const [_audio, _setAudio] = useState();
  const audioRef = useRef(_audio);
  const audio = audioRef.current;
  const setAudio = (data) => {
    audioRef.current = data;
    _setAudio(data);
  };

  let settings;

  if (board.settings) {
    settings = {
      audioPlayer: undefined,
      restartAfterStop: undefined,
    };
    settings = board.settings;
  }

  useEffect(() => {
    if (board) {
      board.sounds.forEach((sound) => {
        const url = `${process.env.REACT_APP_API_URL}/file/${sound.audioFile}`;
        //I tried doing this in it's own object
        //but it didn't work. Thats why it's in window.
        window[sound.id] = new Audio(url);
        window[sound.id].id = sound.id;
        window[sound.id].title = sound.name;
        window[sound.id].addEventListener("ended", () => {
          // setPlaying({ ...playingRef.current, [sound.id]: false });
          stopAudio(sound.id);
        });

        window[sound.id].loop = sound.loop;
      });
    }
    document.addEventListener("keyup", handleKeyDown);

    return () => {
      if (board) {
        board.sounds.forEach((sound) => {
          window[sound.id].removeEventListener("ended", () => {
            stopAudio(sound.id);
          });
        });
      }
      document.removeEventListener("keydown", () => {});
    };
    //React is telling me to include playing in this dependency array
    //but that is a very bad idea and defeats the purpose of this effect
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [board]);

  function startAudio(id) {
    console.log(`starting ${id}`);
    const playingArr = Object.keys(playing);

    //For some reason if I used the stopAudio
    //function here it wouldn't update the state.
    //I'm not sure why. That's why I'm updating
    //all at once.
    let newPlaying = { ...playing };

    if (settings.audioPlayer && !settings.multipleAtATime) {
      for (let i = 0; i < playingArr.length; i++) {
        if (playing[playingArr[i]]) {
          const currId = playingArr[i];
          window[currId].pause();

          if (settings.restartAfterStop) {
            window[currId].currentTime = 0;
          }

          newPlaying[currId] = false;
        }
      }
    }

    window[id].play();
    newPlaying[id] = true;
    setAudio(window[id]);
    setPlaying(newPlaying);
  }

  function stopAudio(id) {
    console.log(`stopping ${id}...`);

    const newPlaying = playingRef.current;
    window[id].pause();

    const sound = board.sounds.find((o) => o.id === id);
    const restart = sound.override ? sound.restart : settings.restartAfterStop;
    if (restart) {
      window[id].currentTime = 0;
    }

    newPlaying[id] = false;
    const playingAudio = Object.keys(newPlaying).find(
      (o) => newPlaying[o] === true
    );
    console.log(newPlaying);
    console.log(playingAudio);
    setPlaying(newPlaying);
    setAudio(window[playingAudio]);
  }

  function pauseAudio(id) {
    console.log(`pausing ${id}...`);
    window[id].pause();
    const newPlaying = playingRef.current;
    newPlaying[id] = false;
    setPlaying(newPlaying);
  }

  function toggleAudio(id) {
    const sound = board.sounds.find((o) => o.id === id);
    const restart = sound.override ? sound.restart : settings.restartAfterStop;

    if (playingRef.current[id] && restart) {
      stopAudio(id);
    } else if (playingRef.current[id]) {
      pauseAudio(id);
    } else if (!playingRef.current[id]) {
      startAudio(id);
    }
  }

  function showAudio(id) {
    setAudio(window[id]);
  }

  function handleKeyDown(e) {
    //stop the currently playing audio when spacebar is pressed
    if (e.code === "Space" && audioRef.current) {
      const audioId = audioRef.current.id;
      console.log(audioRef.current.id);
      console.log(playingRef.current[audioId]);
      toggleAudio(audioId);
    }
  }

  console.log(playing);

  return (
    <div className="board" onKeyDown={() => console.log("pausing")}>
      <div className="board__top">
        <div className="board__top__left">
          <p className="board__top__btns__back" title="Back">
            <Link to={`/dashboard/${board.id}`} className="board__top__btns">
              <span className="material-icons-outlined">arrow_back</span>
            </Link>
          </p>
        </div>
        <h1 className="board__title">{board.title}</h1>
        <div className="board__top__right">
          <p
            className="board__top__btns__settings board__top__btns"
            title="Settings"
          >
            <span className="material-icons-outlined">settings</span>
          </p>
        </div>
      </div>
      <div className="board__grid">
        <SoundGrid
          board={board}
          onToggle={toggleAudio}
          showAudio={showAudio}
          playing={playing}
        />
      </div>
      <div className="board__bottom">
        {settings.audioPlayer && audio ? (
          <AudioPlayer onToggle={toggleAudio} audio={audio} />
        ) : null}
      </div>
    </div>
  );
}

export default Board;
