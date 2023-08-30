import React from "react";
import AddIcon from "@mui/icons-material/Add";
import Fab from "@mui/material/Fab";
import Zoom from "@mui/material/Zoom";

export default function AddButton(props) {
  return (
    <form className="buttonForm">
      <Zoom in={true}>
        <Fab
          className="add-btn"
          onClick={() => {
            props.click();
          }}
          color="primary"
          aria-label="add"
        >
          <AddIcon />
        </Fab>
      </Zoom>
    </form>
  );
}
