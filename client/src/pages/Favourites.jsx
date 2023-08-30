import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Menu from "../components/Menu";
import Ad from "../components/Ad";
import Note from "../components/Note";
import "../styles.css";
const api_base = "http://localhost:3001";

export default function Favourites() {
  const [favourites, setFavourites] = useState([]);
  const [notes, setNotes] = useState([]);
  //triggers loadNotes
  useEffect(() => {
    loadFavourites();
  }, [favourites]);

  //load all favourite notes
  const loadFavourites = async () => {
    await fetch(api_base + "/favourites")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network Error failed to fetch.");
        }
        return response.json();
      })
      .then((data) => {
        setFavourites(data);
      })
      .catch((error) => console.error("Error" + error.message));
  };

  useEffect(() => {
    loadNotes();
  }, [notes]);

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

  //delete Note
  const deleteNote = async (id) => {
    try {
      const response = await fetch(api_base + "/delete/" + id, {
        method: "DELETE",
      });

      if (response.ok) {
        const deletedNote = await response.json();
        setFavourites(
          favourites.filter((note) => note._id !== deletedNote._id)
        );
      }
    } catch (error) {
      console.error("Error:" + error);
    }
  };
  return (
    <>
      <div className="grid-container">
        <Header />
        <Menu />
        <Ad notes={notes} />
        <Footer />
        <div className="container">
          {notes.length === 0 ? (
            <h2 className="message">You don't have any favourites yet.</h2>
          ) : (
            favourites &&
            favourites.map((note) => (
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
