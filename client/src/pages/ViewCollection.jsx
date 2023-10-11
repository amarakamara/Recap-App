import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Menu from "../components/Menu";
import Ad from "../components/Ad";
import AddButton from "../components/AddButton";
import Note from "../components/Note";
import { useNote } from "../contexts/NoteContext";
import { useUser } from "../contexts/UserContext";
import AddToCollection from "../apis/AddToCollection";

import { parse } from "flatted";

import "../styles.css";

const api_base = "http://localhost:3001";

export default function ViewCollection() {
  const { userInfo } = useUser();
  const { collectionId } = useParams();
  const {
    notes,
    setCollectionNotesUpdated,
    collectionNotesUpdated,
    setShowCollectionPane,
    showCollectionPane,
  } = useNote();

  const [collectionNotes, setCollectionNotes] = useState([]);
  const [viewedCollection, setviewedCollection] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          api_base + `/view-collection/${collectionId}/${userInfo._id}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (response.ok) {
          const data = await response.text();
          const returnedCollection = parse(data);
          const notes = returnedCollection.notes;
          setviewedCollection(returnedCollection);
          setCollectionNotes(notes);
          setCollectionNotesUpdated(false);
        }
      } catch (error) {
        console.error("Error fetching collection notes: " + error.message);
      }
    };

    fetchData();
  }, [
    collectionId,
    userInfo._id,
    collectionNotesUpdated,
    setCollectionNotesUpdated,
  ]);

  function AddNoteToCollection(nid) {
    AddToCollection(collectionId, nid, userInfo._id);
  }
  function closeCollectionPane() {
    setShowCollectionPane(false);
  }
  function openCollectionPane() {
    setShowCollectionPane(true);
  }

  return (
    <>
      {showCollectionPane && (
        <div className="collection-pane">
          <button onClick={closeCollectionPane}>X</button>
          {notes.map((note) => {
            return (
              <h3 key={note._id} onClick={() => AddNoteToCollection(note._id)}>
                {note.title}
              </h3>
            );
          })}
        </div>
      )}
      <div className="grid-container">
        <Header />
        <Menu />
        <Ad notes={notes} />
        <AddButton click={openCollectionPane} />
        <Footer />
        <div className="container">
          {collectionNotes.length === 0 ? (
            <h2 className="message">
              You don't have any Notes in this collection.
            </h2>
          ) : (
            <>
              <h2>{viewedCollection.name}</h2>
              <hr />
              {collectionNotes &&
                collectionNotes.map((note, currentPath) => (
                  <Note
                    key={note._id}
                    id={note._id}
                    title={note.title}
                    content={note.content}
                    date={note.createdAt}
                    favourited={note.favourited}
                  />
                ))}
            </>
          )}
        </div>
      </div>
    </>
  );
}
