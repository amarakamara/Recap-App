import React from "react";

export default function Ad(props) {
  return (
    <div className="ad">
      <div className="note-count">
        <h2>Total Note</h2>
        <h3>{props.notes.length}</h3>
      </div>
    </div>
  );
}
