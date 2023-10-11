import React, { useState, useEffect, useRef } from "react";
import AddButton from "./AddButton";
import Button from "@mui/material/Button";
import CancelButton from "./CancelButton";
import { useNote } from "../contexts/NoteContext";
import { useUser } from "../contexts/UserContext";
import addCollection from "../apis/addCollection";

export default function CreateNote() {
  const {
    setCollectionUpdated,
    collectionUpdated,
    collections,
    setCollections,
  } = useNote();
  const { userInfo } = useUser();
  const [collectionName, setCollectionName] = useState("");
  const [isAdded, setIsAdded] = useState(false);
  const prevCollectionsLengthRef = useRef(collections.length);

  useEffect(() => {
    if (collections.length > prevCollectionsLengthRef.current) {
      setIsAdded(true);
      prevCollectionsLengthRef.current = collections.length;
    }
  }, [collections]);

  const [isExpanded, setExpand] = useState(false);
  const [message, setMessage] = useState(null);
  function renderMessage() {
    if (isAdded) {
      setMessage(<p style={{ color: "#54B435" }}>Note added successfully!</p>);
      setTimeout(() => {
        setMessage(null);
      }, 2000);
    } else {
      setMessage(
        <p style={{ color: "#C21010" }}>Something went wrong! Try Again.</p>
      );
      setTimeout(() => {
        setMessage(null);
      }, 2000);
    }
  }

  async function submitCollection(event) {
    addCollection(userInfo, setCollections, collectionName);
    setCollectionUpdated(true);
    console.log("I passed it");
    setCollectionName("");
    renderMessage();
    event.preventDefault();
  }

  /*function handleChange(event) {
    const value = event.target.value;
    setCollectionName((prevValue) => ({
      ...prevValue,
      name: value,
    }));
  }*/

  function expand() {
    setExpand(true);
  }

  function close() {
    setExpand(false);
  }

  return (
    <>
      <div className="wrapper">
        {isExpanded && (
          <form className="note-box" onSubmit={submitCollection}>
            {message}
            <CancelButton click={close} />
            <input
              onChange={(e) => setCollectionName(e.target.value)}
              name="name"
              type="text"
              placeholder="colleciton name"
              value={collectionName}
              autoComplete={collectionName}
            />
            <Button type="submit" variant="contained" size="small">
              Add
            </Button>
          </form>
        )}
      </div>

      <AddButton click={expand} />
    </>
  );
}
