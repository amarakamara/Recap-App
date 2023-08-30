import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import Fab from "@mui/material/Fab";
import Zoom from "@mui/material/Zoom";

export default function CancelButton(props) {
  return (
    <Zoom in={true}>
      <button
        className="cancel-btn"
        onClick={() => {
          props.click();
        }}
        aria-label="add"
      >
        <CloseIcon />
      </button>
    </Zoom>
  );
}
