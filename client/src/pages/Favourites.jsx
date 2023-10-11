import React, { useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Menu from "../components/Menu";
import Ad from "../components/Ad";
import Note from "../components/Note";
import AddToCollection from "../apis/AddToCollection";
import { useNote } from "../contexts/NoteContext";
import { useUser } from "../contexts/UserContext";
import "../styles.css";

const api_base = "http://localhost:3001";

export default function Favourites() {
  const { userInfo } = useUser();

  const {
    notes,
    favouriteNotes,
    setFavouriteNotes,
    updateFavourites,
    setUpdateFavourites,
    collections,
    noteId,
    setShowCollectionPane,
    showCollectionPane,
  } = useNote();

  //triggers loadNotes
  useEffect(() => {
    if (!userInfo) {
      return;
    }
    const loadFavourites = async () => {
      await fetch(api_base + `/favourites/${userInfo._id}`, {
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
          setFavouriteNotes(data);
          setUpdateFavourites(false);
        })
        .catch((error) => console.error("Error" + error.message));
    };

    loadFavourites();
    // eslint-disable-next-line
  }, [userInfo, updateFavourites, setFavouriteNotes]);

  function AddNoteToCollection(cid) {
    AddToCollection(cid, noteId, userInfo._id);
  }

  function closeCollectionPane() {
    setShowCollectionPane(false);
  }
  return (
    <>
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
        <Ad notes={notes} />
        <Footer />
        <div className="container">
          {favouriteNotes.length === 0 ? (
            <h2 className="message">You don't have any favourites yet.</h2>
          ) : (
            favouriteNotes &&
            favouriteNotes.map((note) => (
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
