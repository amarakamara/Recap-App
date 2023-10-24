import getRandomImage from "../apis/getRandomImage";

const api_base = process.env.REACT_APP_API_ENDPOINT;

export default async function addCollection(
  userInfo,
  setCollections,
  collectionName,
  setStatusMessage,
  randomImageUrl
) {
  if (!userInfo) {
    return;
  }
  await getRandomImage(collectionName).then(async (result) => {
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
          imageUrl: result,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setCollections((prevCollections) => [
          ...prevCollections,
          data.collection,
        ]);
        const returnedMessage = data.message;
        setStatusMessage(returnedMessage);
        return returnedMessage;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  });
}
