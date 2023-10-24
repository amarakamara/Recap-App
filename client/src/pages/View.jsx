import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Menu from "../components/Menu";
import Ad from "../components/Ad";
import AccountMobile from "../components/AccountMobile"
import { useNote } from "../contexts/NoteContext";
import { useUser } from "../contexts/UserContext";

import "../styles.css";
const api_base = process.env.REACT_APP_API_ENDPOINT;

export default function View() {
  const { userInfo } = useUser();
  const { noteId } = useParams();
  const { notes } = useNote();
  const [viewedNote, setViewedNote] = useState({
    title: "",
    content: "",
  });

  useEffect(() => {
    fetchData();
  });

  const fetchData = async () => {
    try {
      const response = await fetch(
        api_base + `/view/${noteId}/${userInfo._id}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (response.ok) {
        const data = await response.json();
        setViewedNote(data); // Update viewedNote
      }
    } catch (error) {
      console.error("Error fetching viewed note: " + error.message);
    }
  };

  return (
    <>
      <div className="grid-container">
        <Header />
        <AccountMobile />
        <Menu />
        <Ad notes={notes} />
        <Footer />
        <div className="container">
          <div className="view-note w-full h-full bg-white text-blue py-5 px-10 overflow-y-scroll shadow-md">
            <h2 className="font-jost text-lg">{viewedNote.title}</h2>
            <hr className="w-full h-1" />
            <p className="text-lg pt-5 px-0 pb-0">{viewedNote.content}</p>
          </div>
        </div>
      </div>
    </>
  );
}
