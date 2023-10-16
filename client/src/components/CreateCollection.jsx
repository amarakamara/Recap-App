import React, { useState, useEffect, useRef } from "react";
import AddButton from "./AddButton";
import Button from "@mui/material/Button";
import CancelButton from "./CancelButton";
import { useNote } from "../contexts/NoteContext";
import { useUser } from "../contexts/UserContext";
import addCollection from "../apis/addCollection";

export default function CreateNote() {
  const { setCollectionUpdated, collections, setCollections } = useNote();
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
      setMessage(<p className="text-green">Collection added successfully!</p>);
      setTimeout(() => {
        setMessage(null);
      }, 2000);
    } else {
      setMessage(<p className="text-red">Something went wrong! Try Again.</p>);
      setTimeout(() => {
        setMessage(null);
      }, 2000);
    }
  }

  async function submitCollection(event) {
    addCollection(userInfo, setCollections, collectionName);
    setCollectionUpdated(true);
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
      <div className="absolute w-full max-w-screen max-h-screen h-screen flex flex-col items-center justify-center ">
        {isExpanded && (
          <form
            className="w-80 lg:w-1/2 md:w-1/3 h-auto bg-white rounded-md shadow-md flex flex-col pt-4 px-0 pb-0 absolute right-auto left-auto top-auto z-50 overflow-auto"
            onSubmit={submitCollection}
          >
            {message}
            <CancelButton click={close} />
            <p className="text-xxs ml-3 text-blue">
              Please refresh after adding.
            </p>
            <input
              onChange={(e) => setCollectionName(e.target.value)}
              name="name"
              type="text"
              placeholder="collection name"
              value={collectionName}
              autoComplete={collectionName}
              className="border-0 mb-3 mt-4 ml-2 p-2.5 block"
            />
            <Button
              type="submit"
              variant="contained"
              size="small"
              className="submitNote-btn w-full py-1.5 px-0 text-base font-normal text-white cursor-pointer font-poppins"
            >
              Add
            </Button>
          </form>
        )}
      </div>

      <AddButton click={expand} />
    </>
  );
}
