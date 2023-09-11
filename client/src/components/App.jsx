import React, { useEffect, useState } from "react";
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
  const { notes, setNotes, notesUpdated, setNotesUpdated } = useNote();
  const { userInfo, userID, setUserInfo } = useUser();
  const [userInfoFetched, setUserInfoFetched] = useState(false);

  //fetch userInfo
  useEffect(() => {
    const getUserInfo = async () => {
      if (!userID) {
        return;
      }
      const response = await fetch(api_base + `/user/${userID}`, {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      setUserInfo(data);
      localStorage.setItem("userInfo", data);
      setUserInfoFetched(true);
    };
    getUserInfo();
  }, [userID, setUserInfo]);
  //loadNotes

  useEffect(() => {
    if (!userInfoFetched) {
      return;
    }
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
        setNotesUpdated(false);
      } catch (error) {
        console.error("Error" + error.message);
      }
    };
    loadNotes();
    // eslint-disable-next-line
  }, [setNotes, userInfo, userInfoFetched, notesUpdated]);

  return (
    <>
      <CreateNote />
      <div className="grid-container">
        <Header />
        <Menu />
        <Ad />
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
