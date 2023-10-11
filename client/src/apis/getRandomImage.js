const api_base = "http://localhost:3001";

export default function getRandomImage(query) {
  return fetch(api_base + `/randomImage/${query}`, {
    method: "GET",
    credentials: "include",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      const imageUrl = data;
      return imageUrl;
    })
    .catch((error) => {
      console.error("Error:", error);
      throw error;
    });
}
