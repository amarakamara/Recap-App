import React, { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Menu from "../components/Menu";
import Ad from "../components/Ad";
import Button from "@mui/material/Button";
import "../styles.css";
const api_base = "http://localhost:3001";

export default function EditNote() {
  const { noteId } = useParams();
  const [notes, setNotes] = useState([]);
  const [noteData, setNoteData] = useState({
    title: "",
    content: "",
  });
  const [updateSuccess, setSuccess] = useState(false);

  useEffect(() => {
    noteEdited(noteId)
      .then((data) => {
        setNoteData(data);
      })
      .catch((err) => console.error(err));
  }, [noteId]);

  useEffect(() => {
    loadNotes();
  }, [notes]);

  const noteEdited = async (noteId) => {
    const response = await fetch(api_base + `/edit/${noteId}`);

    if (!response.ok) {
      throw new Error("Network Error failed to fetch.");
    }
    const data = response.json();
    return data;
  };

  //load all notes
  const loadNotes = async () => {
    await fetch(api_base + "/notes")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network Error failed to fetch.");
        }
        return response.json();
      })
      .then((data) => {
        setNotes(data);
      })
      .catch((error) => console.error("Error" + error.message));
  };

  const handleClick = async (event) => {
    event.preventDefault();
    try {
      await fetch(api_base + `/edit/${noteId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(noteData),
      });
    } catch (error) {
      setSuccess(false);
      console.error("Error:", error.message);
    }
    setSuccess(true);
  };

  function handleChange(event) {
    const { name, value } = event.target;

    setNoteData((prevValue) => ({
      ...prevValue,
      [name]: value,
    }));
  }

  return (
    <>
      <div className="grid-container">
        <Header />
        <Menu />
        <Ad notes={notes} />
        <Footer />
        <div className="container">
          <form className="edit-form" method="Post">
            <input
              onChange={handleChange}
              name="title"
              type="text"
              value={noteData.title}
            />
            <textarea
              onChange={handleChange}
              rows="3"
              name="content"
              value={noteData.content}
            />
            <Button onClick={handleClick} variant="contained" size="small">
              Update
            </Button>
          </form>
        </div>
      </div>
      {updateSuccess && <Navigate to="/" replace={true} />}
    </>
  );
}
