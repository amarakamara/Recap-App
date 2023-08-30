import React from "react";
import { NavLink } from "react-router-dom";

import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";

function Note(props) {
  const contentToDisplay =
    props.content.length >= 200
      ? props.content.substring(0, 50) + " "
      : props.content;

  function handleDelete() {
    props.onDelete(props.id);
  }

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
