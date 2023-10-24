const api_base = process.env.REACT_APP_API_ENDPOINT;

const AddNoteToCollection = async (collectionId, noteId, userId) => {
  try {
    const response = await fetch(
      api_base + `/collection/addnotes/${collectionId}/${userId}`,
      {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          noteId: noteId,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Network Error failed to fetch.");
    }

    const data = await response.json();
    return data.message; // Return the message from the fetch response.
  } catch (error) {
    console.error("Error" + error.message);
    return null;
  }
};

export default AddNoteToCollection;
