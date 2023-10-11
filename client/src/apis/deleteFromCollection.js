const api_base = "http://localhost:3001";

const deleteFromCollection = async (collectionId, noteId, userId) => {
  try {
    await fetch(api_base + `/collection/deletenote/${collectionId}/${userId}`, {
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

export default deleteFromCollection;
