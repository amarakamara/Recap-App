import React, { useEffect, useState } from "react";
import Header from "./Header";
import Note from "./Note";
import Footer from "./Footer";
import CreateNote from "./CreateNote";
import Message from "./Message";
import Menu from "./Menu";
import Ad from "./Ad";
import AddToCollection from "../apis/AddToCollection";
import { useUser } from "../contexts/UserContext";
import { useNote } from "../contexts/NoteContext";

import "../styles.css";

const api_base = "http://localhost:3001";

export default function App() {
  const {
    notes,
    setNotes,
    notesUpdated,
    setNotesUpdated,
    collections,
    setCollections,
    noteId,
    setShowCollectionPane,
    showCollectionPane,
  } = useNote();

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
      localStorage.setItem("userInfo", JSON.stringify(data));
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

  //load all collections
  useEffect(() => {
    if (!userInfo) {
      return;
    }

    const loadCollections = async () => {
      await fetch(api_base + `/collections/${userInfo._id}`, {
        method: "GET",
        credentials: "include",
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network Error failed to fetch.");
          }
          return response.json();
        })
        .then((data) => {
          setCollections(data);
        })
        .catch((error) => console.error("Error" + error.message));
    };

    loadCollections();
    // eslint-disable-next-line
  }, [userInfo]);

  function AddNoteToCollection(cid) {
    AddToCollection(cid, noteId, userInfo._id);
  }

  function closeCollectionPane() {
    setShowCollectionPane(false);
  }

  return (
    <>
      <CreateNote />
      {showCollectionPane && (
        <div className="collection-pane">
          <button onClick={closeCollectionPane}>X</button>
          {collections.map((collection) => {
            return (
              <h3
                key={collection._id}
                onClick={() => AddNoteToCollection(collection._id)}
              >
                {collection.name}
              </h3>
            );
          })}
        </div>
      )}
      <div className="grid-container">
        <Header />
        <Menu />
        <Ad />
        <Footer />

        <div className="container w-full h-full pl-0 mt-10 flex flex-row flex-wrap flex-grow-0 overflow-y-scroll ">
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
