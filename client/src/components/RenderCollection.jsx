import React from "react";
import { NavLink } from "react-router-dom";
//import getRandomImage from "../apis/getRandomImage";
//import { useNote } from "../contexts/NoteContext";
import { useUser } from "../contexts/UserContext";
import { useNote } from "../contexts/NoteContext";
import deleteCollection from "../apis/deleteCollection";

export default function RenderCollection(props) {
  const {
    collections,
    setCollections,
    setCollectionUpdated,
    setShowCollectionPane,
    showCollectionPane,
    setCollectionId,
  } = useNote();

  const { userInfo } = useUser();

  function openCollectionPane() {
    setCollectionId(props.id);
    setShowCollectionPane(true);
    console.log("pane value", showCollectionPane);
  }

  function handleDelete() {
    deleteCollection(props.id, userInfo, collections, setCollections);
    setCollectionUpdated(true);
  }

  return (
    <>
      <div>
        <div className="collection">
          <div>
            <img
              className="collection-img"
              src={
                props.img
                  ? props.img
                  : "https://images.unsplash.com/photo-1693858837984-c0a8829fe3d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxOXx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=60"
              }
              alt="random scenery"
            />
          </div>
          <div>
            <h2>{props.name}</h2>
            <div>
              <p>{props.date}</p>
              <button onClick={handleDelete}>Delete</button>
              <button onClick={openCollectionPane}>ANTC</button>
              <NavLink to={`/view-collection/${props.id}`}>
                View Collection
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
