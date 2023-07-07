import React, { useState } from "react";
import ReactQuill from "react-quill";
import "/Users/chitrangadsingh/Desktop/MetaJungle/task-desk/src/styles/quill.bubble.css";

const NoteForm = ({ addNote }) => {
  const [noteText, setNoteText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const newNote = {
      id: Date.now(),
      text: noteText,
      responded: false,
    };
    addNote(newNote);

    const storedNotes = JSON.parse(localStorage.getItem("notes")) || [];
    storedNotes.push(newNote);
    localStorage.setItem("notes", JSON.stringify(storedNotes));

    setNoteText("");
  };

  return (
    <div>
      <h3>Add Note</h3>
      <form onSubmit={handleSubmit}>
        <ReactQuill
          value={noteText}
          onChange={setNoteText}
          theme="bubble"
          placeholder="Enter note text..."
        />
        <p>
          <button type="submit">Submit</button>
        </p>
      </form>
    </div>
  );
};

export default NoteForm;
