import React from "react";
//import { useNote } from "../contexts/NoteContext";
//import { useUser } from "../contexts/UserContext";

export default function RenderCollection(props) {
  const imageURL =
    "https://media.istockphoto.com/id/1370681143/photo/doctor-check-with-analysis-blue-helix-dna-structure-on-scientific-background-dna-genetic-of.webp?b=1&s=170667a&w=0&k=20&c=0GYGqfeOqd6EdKAww5yXLpIsaDwYwQuRdzCcKReATTY=";
  return (
    <>
      <div>
        <div className="collection">
          <div>
            <img src={imageURL} alt="random scenery" />
          </div>
          <div>
            <h2>{props.name}</h2>
            <div>
              <p>{props.date}</p>
              <button>Delete</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
