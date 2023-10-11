const api_base = "http://localhost:3001";

const AddNoteToCollection = async (collectionId, noteId, userId) => {
  try {
    await fetch(api_base + `/collection/addnotes/${collectionId}/${userId}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        noteId: noteId,
      }),
    });
  } catch (error) {
    console.error(error);
  }
};

export default AddNoteToCollection;
