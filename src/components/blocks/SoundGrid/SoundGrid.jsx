import React from "react";

import {
  ContextMenu,
  ContextMenuItem,
  ContextMenuTrigger,
} from "rctx-contextmenu";

import "./SoundGrid.css";

function SoundBtn({ sound, onToggle, playing, showAudio }) {
  return (
    <>
      <ContextMenuTrigger
        disable={playing[sound.id] ? false : true}
        id={sound.id}
      >
        <p
          className={
            playing[sound.id]
              ? "sound_grid__item sound_grid__item--playing"
              : "sound_grid__item"
          }
          onClick={() => {
            onToggle(sound.id);
          }}
        >
          {sound.name}
        </p>
      </ContextMenuTrigger>
      <ContextMenu id={sound.id}>
        <ContextMenuItem onClick={() => showAudio(sound.id)}>
          Show Audio
        </ContextMenuItem>
      </ContextMenu>
    </>
  );
}

function SoundGrid({ board, onToggle, showAudio, playing, ...props }) {
  return (
    <div className="sound_grid">
      {board.sounds.map((sound) => {
        return (
          <SoundBtn
            key={sound.id}
            sound={sound}
            onToggle={onToggle}
            showAudio={showAudio}
            playing={playing}
          />
        );
      })}
    </div>
  );
}

export default SoundGrid;
