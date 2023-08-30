import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Menu from "../components/Menu";
import Ad from "../components/Ad";
import "../styles.css";
const api_base = "http://localhost:3001";

export default function View() {
  const { noteId } = useParams();
  const [notes, setNotes] = useState([]);
  const [viewedNote, setViewedNote] = useState({
    title: "",
    content: "",
  });

  useEffect(() => {
    loadNotes();
  }, [notes]);

  useEffect(() => {
    fetchData();
  });

  const fetchData = async () => {
    try {
      const response = await fetch(api_base + `/view/${noteId}`);
      if (response.ok) {
        const data = await response.json();
        setViewedNote(data); // Update viewedNote
      }
    } catch (error) {
      console.error("Error fetching viewed note: " + error.message);
    }
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

  return (
    <>
      <div className="grid-container">
        <Header />
        <Menu />
        <Ad notes={notes} />
        <Footer />
        <div className="container">
          <div className="view-note">
            <h2>{viewedNote.title}</h2>
            <hr />
            <p>{viewedNote.content}</p>
          </div>
        </div>
      </div>
    </>
  );
}
