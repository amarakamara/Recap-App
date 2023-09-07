import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Menu from "../components/Menu";
import Ad from "../components/Ad";
import Note from "../components/Note";
import { useNote } from "../contexts/NoteContext";

import "../styles.css";
const api_base = "http://localhost:3001";

export default function Favourites() {
  const { notes } = useNote();
  const [favourites, setFavourites] = useState([]);

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
