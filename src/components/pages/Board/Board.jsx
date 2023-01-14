import React from "react";
import { useContext, useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

import "./Board.css";

import DatabaseContext from "../../../contexts/DatabaseContext";
import SoundGrid from "../../blocks/SoundGrid/SoundGrid";
import AudioPlayer from "../../blocks/AudioPlayer/AudioPlayer";

function Board() {
  const { dbResults } = useContext(DatabaseContext);
  const { boardId } = useParams();
  const board = dbResults.boards.find((o) => o.id === boardId);

  const [playing, setPlaying] = useState({});

  //Only used if audioPlayer is enabled
  //Need it to pass to the audio player
  //to know what the properties are.
  const [audio, setAudio] = useState();

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
          setPlaying({ ...playing, [sound.id]: false });
        });

        window[sound.id].loop = sound.loop;
      });
    }
    //React is telling me to include playing in this dependency array
    //but that is a very bad idea and defeats the purpose of this effect
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [board]);

  function startAudio(id) {
    const playingArr = Object.keys(playing);

    //For some reason if I used the stopAudio
    //function here it wouldn't update the state.
    //I'm not sure why. That's why I'm updating
    //all at once.
    let newPlaying = { ...playing };

    if (settings.audioPlayer) {
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
    window[id].pause();
    if (settings.restartAfterStop) {
      window[id].currentTime = 0;
    }
    setPlaying({ ...playing, [id]: false });
  }

  function toggleAudio(id) {
    if (playing[id]) {
      stopAudio(id);
    } else if (!playing[id]) {
      startAudio(id);
    }
  }

  return (
    <div className="board">
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
        <SoundGrid board={board} onToggle={toggleAudio} playing={playing} />
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
