const api_base = process.env.REACT_APP_API_ENDPOINT;

export default async function deleteCollection(
  id,
  userInfo,
  collections,
  setCollections
) {
  try {
    const response = await fetch(api_base + `/collection/delete/${id}/${userInfo._id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (response.ok) {
      const deletedCollection = await response.json();
      setCollections(
        collections.filter(
          (collection) => collection._id !== deletedCollection._id
        )
      );
    }
  } catch (error) {
    console.error("Error:" + error);
  }
}
