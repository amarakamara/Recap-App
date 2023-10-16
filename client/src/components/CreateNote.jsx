import React, { useState, useEffect, useRef } from "react";
import AddButton from "./AddButton";
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
      setMessage(<p className="text-green">Note added successfully!</p>);
      setTimeout(() => {
        setMessage(null);
      }, 2000);
    } else {
      setMessage(<p className="text-red">Something went wrong! Try Again.</p>);
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
      <div className="absolute w-full max-w-screen max-h-screen h-screen flex flex-col items-center justify-center ">
        {isExpanded && (
          <form
            className="w-80 lg:w-1/2 md:w-1/3 h-auto bg-white rounded-md shadow-md flex flex-col pt-4 px-0 pb-0 absolute right-auto left-auto top-auto z-50 overflow-auto"
            onSubmit={submitNote}
          >
            {message}
            <CancelButton click={close} />
            <input
              onChange={handleChange}
              name="title"
              type="text"
              placeholder="title"
              value={note.title}
              className="border-0 mb-3 mt-4 ml-2 p-2.5 block"
            />
            <textarea
              rows="8"
              onChange={handleChange}
              name="content"
              placeholder="note.."
              value={note.content}
              className="border-0 mb-3 ml-2 p-2.5 block"
            />
            <button
              type="submit"
              className="submitNote-btn w-full py-1.5 px-0 text-base font-normal text-white cursor-pointer font-poppins"
            >
              Add
            </button>
          </form>
        )}
      </div>

      <AddButton click={expand} />
    </>
  );
}
