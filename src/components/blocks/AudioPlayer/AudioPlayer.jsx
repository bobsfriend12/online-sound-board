import React, { useState } from "react";
import { useEffect } from "react";

import "./AudioPlayer.css";

function AudioPlayer({ onToggle, audio }) {
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(100);
  const [muted, setMuted] = useState(false);
  const [volumeBeforeMute, setVolumeBeforeMute] = useState(0);

  useEffect(() => {
    audio.addEventListener("timeupdate", () => {
      setCurrentTime(audio.currentTime);
    });
    return () =>
      audio.removeEventListener("timeupdate", () => {
        console.log("removed listener");
      });
  }, [audio]);

  audio.volume = volume / 100;

  const calculateTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${minutes}:${returnedSeconds}`;
  };

  const toggleMute = () => {
    let volumeToSet = muted ? volumeBeforeMute : 0;
    if (!muted) {
      setVolumeBeforeMute(volume);
    }
    setVolume(volumeToSet);
    setMuted(!muted);
  };

  // let bufferedTime = audio.buffered.end(audio.buffered.length - 1);
  // let seekableAmount = audio.seekable.end(audio.seekable.length - 1);

  document.documentElement.style.setProperty(
    "--before-thumb-width",
    `${(Math.floor(audio.currentTime) / audio.duration) * 100}%`
  );

  document.documentElement.style.setProperty(
    "--before-thumb-width-volume",
    `${volume}%`
  );

  return (
    <div className="audio_player">
      <div className="audio_player__left">{audio.title}</div>
      <div className="audio_player__center">
        <div className="audio_player__center__icons">
          <span
            onClick={() => onToggle(audio.id)}
            className="material-icons-outlined audio_player__icon"
          >
            {!audio.paused ? "pause_circle" : "play_circle"}
          </span>
        </div>
        <p className="audio_player__current_time">
          {calculateTime(audio.currentTime)}
        </p>
        <div className="audio_player__progress_bar">
          <input
            type="range"
            name="progress"
            id="seek-slider"
            className="audio_player__progress"
            min="0"
            max={audio.duration}
            value={Math.floor(currentTime)}
            onChange={(e) => {
              audio.currentTime = e.target.value;
            }}
          />
          {/* {Math.floor(currentTime)} */}
        </div>
        <p className="audio_player__duration">
          {calculateTime(audio.duration)}
        </p>
      </div>
      <div className="audio_player__right">
        <p className="audio_player__volume_icon">
          {muted ? (
            <span
              onClick={toggleMute}
              className="material-icons-outlined audio_player__right__icons"
            >
              volume_off
            </span>
          ) : (
            <span
              onClick={toggleMute}
              className="material-icons-outlined audio_player__right__icons"
            >
              volume_up
            </span>
          )}
        </p>
        <input
          type="range"
          name="progress"
          id="seek-slider"
          className="audio_player__volume"
          // min="0"
          max="100"
          step=".1"
          value={volume}
          onChange={(e) => {
            setVolume(e.target.value);
          }}
        />
      </div>
    </div>
  );
}

export default AudioPlayer;
