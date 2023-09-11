import React, { useState, useEffect, useRef } from "react";
import AddButton from "./AddButton";
import Button from "@mui/material/Button";
import CancelButton from "./CancelButton";
import { useNote } from "../contexts/NoteContext";
import { useUser } from "../contexts/UserContext";
import addNote from "../apis/addNotes";

export default function CreateNote(props) {
  const { notes, setNotes, setNotesUpdated } = useNote();
  const { userInfo } = useUser();
  const [note, setNote] = useState({
    title: "",
    content: "",
  });

  const [isAdded, setIsAdded] = useState(false);
  const prevNotesLengthRef = useRef(notes.length);

  useEffect(() => {
    if (notes.length > prevNotesLengthRef.current) {
      setIsAdded(true);
      prevNotesLengthRef.current = notes.length;
    }
  }, [notes]);

  const [isExpanded, setExpand] = useState(false);
  const [message, setMessage] = useState(null);
  function renderMessage() {
    if (isAdded) {
      setMessage(<p style={{ color: "#54B435" }}>Note added successfully!</p>);
      setTimeout(() => {
        setMessage(null);
      }, 2000);
    } else {
      setMessage(
        <p style={{ color: "#C21010" }}>Something went wrong! Try Again.</p>
      );
      setTimeout(() => {
        setMessage(null);
      }, 2000);
    }
  }

  function submitNote(event) {
    addNote(userInfo, setNotes, note);
    setNotesUpdated(true);
    setNote({
      title: "",
      content: "",
    });
    renderMessage();
    event.preventDefault();
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setNote((prevValue) => ({
      ...prevValue,
      [name]: value,
    }));
  }

  function expand() {
    setExpand(true);
  }

  function close() {
    setExpand(false);
  }

  return (
    <>
      <div className="wrapper">
        {isExpanded && (
          <form className="note-box" onSubmit={submitNote}>
            {message}
            <CancelButton click={close} />
            <input
              onChange={handleChange}
              name="title"
              type="text"
              placeholder="title"
              value={note.title}
            />
            <textarea
              rows="3"
              onChange={handleChange}
              name="content"
              placeholder="note.."
              value={note.content}
            />
            <Button type="submit" variant="contained" size="small">
              Add
            </Button>
          </form>
        )}
      </div>

      <AddButton click={expand} />
    </>
  );
}
