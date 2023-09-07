import React, { useState, useEffect } from "react";
import Header from "./Header";
import Note from "./Note";
import Footer from "./Footer";
import CreateNote from "./CreateNote";
import Message from "./Message";
import Menu from "./Menu";
import Ad from "./Ad";
import { useUser } from "../contexts/UserContext";
import { useNote } from "../contexts/NoteContext";

import "../styles.css";

const api_base = "http://localhost:3001";

export default function App() {
  const { notes, setNotes } = useNote();
  const [noteAdded, setNoteAdded] = useState(false);
  //const { isAuthenticated, setIsAuthenticated } = useAuth();
  const { userInfo, setUserInfo, userID } = useUser();
  const [userInfoFetched, setUserInfoFetched] = useState(false);

  useEffect(() => {
    const getUserInfo = async () => {
      if (!userID) {
        return;
      }
      const response = await fetch(api_base + `/user/${userID}`, {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json(); // Note: Added 'await' here
      setUserInfo(data);
      localStorage.setItem("userInfo", data);
      setUserInfoFetched(true);
    };
    getUserInfo();
  }, [userID, setUserInfo]);

  //load all notes
  useEffect(() => {
    if (!userInfoFetched) {
      return;
    }

    loadNotes();
    setNoteAdded(true);
    // eslint-disable-next-line
  }, [userInfo._id, notes, userInfoFetched, noteAdded]);

  const loadNotes = async () => {
    try {
      const response = await fetch(api_base + `/notes/${userInfo._id}`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Network Error failed to fetch.");
      }

      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.error("Error" + error.message);
    }
  };
  //Add note
  const addNote = async (note, userInfo) => {
    if (!userInfoFetched) {
      return;
    }
    try {
      const response = await fetch(api_base + "/addnotes", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          title: note.title,
          content: note.content,
          userID: userID,
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
