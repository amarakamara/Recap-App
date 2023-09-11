const api_base = "http://localhost:3001";

export default async function addNote(userInfo, setNotes, note) {
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
      const newNote = await response.json();
      setNotes((prevNotes) => [...prevNotes, newNote]);
    }
  } catch (error) {
    console.error(error);
  }
}
