const api_base = process.env.REACT_APP_API_ENDPOINT;

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
