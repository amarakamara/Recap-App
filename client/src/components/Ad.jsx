import React from "react";
import { useNote } from "../contexts/NoteContext";

export default function Ad() {
  const { notes } = useNote();
  return (
    <div className="ad">
      <div className="note-count">
        <h2>Total Note</h2>
        <h3>{notes.length}</h3>
      </div>
    </div>
  );
}
