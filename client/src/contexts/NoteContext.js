import React, { useState, createContext, useContext } from "react";

const NoteContext = createContext();

export function useNote() {
  return useContext(NoteContext);
}

export function NoteProvider(props) {
  const [notes, setNotes] = useState([]);

  const values = { notes, setNotes };

  return (
    <NoteContext.Provider value={values}>
      {props.children}{" "}
    </NoteContext.Provider>
  );
}
