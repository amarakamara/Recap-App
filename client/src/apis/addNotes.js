const api_base = "http://localhost:3001";

export default async function addNote(
  userInfo,
  setNotes,
  note,
  setNotesUpdated
) {
  if (!userInfo) {
    return;
  }
  try {
    const response = await fetch(api_base + "/addnotes", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        title: note.title,
        content: note.content,
        userID: userInfo._id,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      setNotes((prevNotes) => [...prevNotes, data.note]);
      const returnedMessage = data.message;
      return returnedMessage;
    }
  } catch (error) {
    setNotesUpdated(false);
    console.error(error);
  }
}
