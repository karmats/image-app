const API_ROOT_URL = process.env.API_ROOT_URL || "http://localhost:3002";

const asJson = (response) => response.json();

const imageToImageSrc = (image) => ({
  ...image,
  src: API_ROOT_URL + image.path,
});

const getImages = () =>
  fetch(`${API_ROOT_URL}/images`)
    .then(asJson)
    .then((result) => {
      if (result.status === "success") {
        return result.data.map(imageToImageSrc);
      }
      throw new Error(result.message);
    });

const postImage = (name, file) => {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("photo", file);
  return fetch(`${API_ROOT_URL}/images`, {
    method: "POST",
    body: formData,
  })
    .then(asJson)
    .then((result) => {
      if (result.status === "success") {
        return imageToImageSrc(result.data);
      }
      throw new Error(result.data);
    });
};

export { getImages, postImage };
