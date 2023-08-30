import React, { useState, useEffect } from "react";
import Header from "./Header";
import Note from "./Note";
import Footer from "./Footer";
import CreateNote from "./CreateNote";
import Message from "./Message";
import Menu from "./Menu";
import Ad from "./Ad";

import "../styles.css";

const api_base = "http://localhost:3001";

export default function App() {
  const [notes, setNotes] = useState([]);
  const [noteAdded, setNoteAdded] = useState(false);

  //triggers loadNotes
  useEffect(() => {
    loadNotes();
    setNoteAdded(true);
  }, [notes, noteAdded]);

  //load all notes
  const loadNotes = async () => {
    await fetch(api_base + "/notes")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network Error failed to fetch.");
        }
        return response.json();
      })
      .then((data) => {
        setNotes(data);
      })
      .catch((error) => console.error("Error" + error.message));
  };

  //Add note
  const addNote = async (note) => {
    try {
      const response = await fetch(api_base + "/add", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          title: note.title,
          content: note.content,
        }),
      });

      if (response.ok) {
        const newNote = await response.json();
        setNotes((prevNotes) => [...prevNotes, newNote]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  //delete Note
  const deleteNote = async (id) => {
    try {
      const response = await fetch(api_base + "/delete/" + id, {
        method: "DELETE",
      });

      if (response.ok) {
        const deletedNote = await response.json();
        setNotes(notes.filter((note) => note._id !== deletedNote._id));
      }
    } catch (error) {
      console.error("Error:" + error);
    }
  };

  return (
    <>
      <CreateNote onAdd={addNote} isAdded={noteAdded} />
      <div className="grid-container">
        <Header />
        <Menu />
        <Ad notes={notes} />
        <Footer />

        <div className="container">
          {notes.length === 0 ? (
            <Message />
          ) : (
            notes &&
            notes.map((note) => (
              <Note
                key={note._id}
                id={note._id}
                title={note.title}
                content={note.content}
                onDelete={deleteNote}
                date={note.createdAt}
                favourited={note.favourited}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
}
