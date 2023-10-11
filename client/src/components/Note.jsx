import React, { useState } from "react";
import { NavLink, useLocation, useParams } from "react-router-dom";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useUser } from "../contexts/UserContext";
import { useNote } from "../contexts/NoteContext";
import deleteNote from "../apis/deleteNote";
import deleteFromCollection from "../apis/deleteFromCollection";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const api_base = "http://localhost:3001";

function Note(props) {
  const location = useLocation();
  const currentPath = location.pathname;
  const { collectionId } = useParams();
  const { userInfo } = useUser();
  const [openOption, setOpenOption] = useState(false);
  const {
    setCollectionNotesUpdated,
    setShowCollectionPane,
    notes,
    setNotes,
    setNotesUpdated,
    setUpdateFavourites,
    setNoteId,
  } = useNote();

  const contentToDisplay =
    props.content.length >= 200
      ? props.content.substring(0, 50) + " "
      : props.content;

  function openCollectionPane() {
    setNoteId(props.id);
    setShowCollectionPane(true);
  }
  function openOptionPane() {
    setOpenOption(!openOption);
  }

  function handleDelete() {
    deleteNote(props.id, userInfo, notes, setNotes);
    setNotesUpdated(true);
  }

  const toggleFavourites = async () => {
    try {
      await fetch(api_base + `/toggleFavourites/${props.id}/${userInfo._id}`, {
        method: "PUT",
        credentials: "include",
      });
      setNotesUpdated(true);
      setUpdateFavourites(true);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  function handleRemove() {
    deleteFromCollection(collectionId, props.id, userInfo._id);
    setCollectionNotesUpdated(true);
  }

  return (
    <div className="note bg-white rounded-md box-border w-215 max-h-auto my-0 mx-4 relative overflow-hidden self-start">
      {openOption && (
        <div className="absolute right-5 top-1 max-w-50vw h-auto z-10 bg-blue bg-opacity-90 text-white p-1">
          <p className="mt-1 text-xxs block" onClick={openCollectionPane}>
            Add to Collection
          </p>
          {currentPath.startsWith("/view-collection") && (
            <p className="mt-1 text-xl block" onClick={handleRemove}>
              Remove from Collection
            </p>
          )}
          <a
            href={`/edit/${props.id}`}
            className="mt-1 text-xxs block text-white"
          >
            Edit
          </a>
          <p onClick={handleDelete} className="mt-1 text-xxs block">
            Delete
          </p>
        </div>
      )}

      <div className="noteTop w-full h-7 relative text-blue p-0">
        <MoreVertIcon className="absolute right-0" onClick={openOptionPane} />
      </div>

      <div className="pl-2">
        <h1 className="text-blue font-jost text-2xl mb-2 block">
          {props.title}
        </h1>
        <p className="text-base mb-2 whitespace-pre-wrap break-words block text-blue">
          {contentToDisplay}
        </p>
        {props.content.length >= 200 && (
          <NavLink className="text-base text-blue" to={`/view/${props.id}`}>
            read more
          </NavLink>
        )}
      </div>
      <div className="note-meta w-full py-0 px-2 bg-blue flex flex-row items-center justify-center flex-nowrap relative bottom-0 z-0">
        <p className="text-xxs whitespace-pre break-words my-auto mx-0 w-full text-white">
          Created: {props.date}
        </p>

        <div className="flex flex-row p-0 m-0 ml-auto">
          <button className="border-0" onClick={toggleFavourites}>
            {props.favourited ? (
              <FavoriteOutlinedIcon className="favourite text-Dred text-xxs" />
            ) : (
              <FavoriteBorderIcon className="unfavourite text-white text-xxs" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Note;
