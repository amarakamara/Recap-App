const api_base = process.env.REACT_APP_API_ENDPOINT;

export default async function deleteNote(id, userInfo, notes, setNotes) {
  try {
    const response = await fetch(
      api_base + `/note/delete/${id}/${userInfo._id}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    if (response.ok) {
      const deletedNote = await response.json();
      setNotes(notes.filter((note) => note._id !== deletedNote._id));
    }
  } catch (error) {
    console.error("Error:" + error);
  }
}
