import React, { useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Menu from "../components/Menu";
import Ad from "../components/Ad";
import RenderCollection from "../components/RenderCollection";
import CreateCollection from "../components/CreateCollection";
import { useNote } from "../contexts/NoteContext";
import { useUser } from "../contexts/UserContext";
import "../styles.css";

const api_base = "http://localhost:3001";

export default function Collections() {
  const { userInfo } = useUser();

  const {
    notes,
    collections,
    setCollections,
    collectionUpdated,
    setCollectionUpdated,
  } = useNote();

  //load all collections
  useEffect(() => {
    console.log(userInfo);
    if (!userInfo) {
      return;
    } else if (!collectionUpdated) {
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
          setCollectionUpdated(false);
        })
        .catch((error) => console.error("Error" + error.message));
    };

    loadCollections();
    // eslint-disable-next-line
  }, [userInfo, collectionUpdated, setCollections]);

  return (
    <>
      <CreateCollection />
      <div className="grid-container">
        <Header />
        <Menu />
        <Ad notes={notes} />
        <Footer />
        <div className="container">
          {collections.length === 0 ? (
            <h2 className="message">
              You don't have any collections yet. Click the + button to start
              adding.
            </h2>
          ) : (
            collections &&
            collections.map((collection) => (
              <RenderCollection
                key={collection._id}
                id={collection._id}
                name={collection.name}
                date={collection.createdAt}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
}
