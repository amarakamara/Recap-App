import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const api_base = "http://localhost:3001";

function Note(props) {
  const contentToDisplay =
    props.content.length >= 200
      ? props.content.substring(0, 50) + " "
      : props.content;

  function handleDelete() {
    props.onDelete(props.id);
  }

  const toggleFavourites = async () => {
    try {
      const response = await fetch(api_base + `/toggleFavourites/${props.id}`, {
        method: "PUT",
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="note">
      <div>
        <h1>{props.title}</h1>
        <p>{contentToDisplay}</p>
        {props.content.length >= 200 && (
          <NavLink to={`/view/${props.id}`}>read more</NavLink>
        )}
      </div>
      <div className="note-meta">
        <p>Created: {props.date}</p>
        <div className="note-tools">
          <button className="favourite-btn" onClick={toggleFavourites}>
            {props.favourited ? (
              <FavoriteOutlinedIcon className="favourite" />
            ) : (
              <FavoriteBorderIcon className="unfavourite" />
            )}
          </button>
          <NavLink to={`/edit/${props.id}`} className="edit-button">
            <ModeEditIcon />
          </NavLink>
          <button onClick={handleDelete} className="delete-btn">
            <DeleteIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Note;
