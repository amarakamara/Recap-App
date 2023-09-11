const api_base = "http://localhost:3001";

export default async function addCollection(
  userInfo,
  setCollections,
  collectionName
) {
  console.log(userInfo);
  if (!userInfo) {
    return;
  }
  try {
    const response = await fetch(api_base + "/createCollection", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        name: collectionName,
        userID: userInfo._id,
      }),
    });

    if (response.ok) {
      const newCollection = await response.json();
      setCollections((prevCollections) => [...prevCollections, newCollection]);
    }
  } catch (error) {
    console.error(error);
  }
}
