import React, { useEffect, useState } from "react";
import { getImages, postImage } from "./apis/imageUploadApi";
import "./App.css";
import DragAndDrop from "./components/DragAndDrop";
import FileUploadButton from "./components/FileUploadButton";
import ImageList from "./components/ImageList";
import Input from "./components/Input/Input";
import Modal from "./components/Modal";
import Notification from "./components/Notification";

const ACCEPTED_IMAGE_TYPES = ["image/png", "image/jpeg"];

function App() {
  // Uploaded images
  const [images, setImages] = useState([]);

  // Image name
  const [name, setName] = useState("");
  const handleNameInputChange = (evt) => setName(evt.target.value);

  // Modal
  const [isModalActive, setIsModalActive] = useState(false);
  const handleModalClose = () => {
    setIsModalActive(false);
    setNotification(null);
  };
  const handleModalConfirm = () => {
    if (name) {
      setFile(null);
      setName("");
      handleModalClose();
      postImage(name, file)
        .then((image) => {
          setImages([image, ...images]);
        })
        .catch(() => {
          setNotification({ text: "Failed to upload image :(", type: "error" });
        });
    } else {
      setNotification({ text: "You need to provide a name", type: "error" });
    }
  };

  // File
  const [file, setFile] = useState(null);
  const handleFileChange = (file) => {
    setIsModalActive(true);
    setFile(file);
  };

  // Notification message
  const [notification, setNotification] = useState(null);
  const handleNotificationDismiss = () => {
    setNotification(null);
  };

  // Fetch images
  useEffect(() => {
    getImages()
      .then(setImages)
      .catch(() =>
        setNotification({
          type: "error",
          text: "Could not to retrieve images, please check that the server is running",
        })
      );
  }, []);
  return (
    <div className="App">
      {notification && (
        <Notification
          type={notification.type}
          text={notification.text}
          onDismiss={handleNotificationDismiss}
        />
      )}
      <header className="App-header">
        <h1>Image Uploading App</h1>
        <FileUploadButton
          label="Upload"
          accept={ACCEPTED_IMAGE_TYPES.join(",")}
          onFileChange={handleFileChange}
        ></FileUploadButton>
      </header>
      <main className="App-content">
        <div className="App-description">
          <DragAndDrop onFileChange={handleFileChange}>
            Welcome to the Image Upload App. Drag an image here or use the
            "Upload"-button.
          </DragAndDrop>
        </div>
        <ImageList images={images}></ImageList>
      </main>
      <Modal
        active={isModalActive}
        title="Give the image a name"
        onClose={handleModalClose}
        onConfirm={handleModalConfirm}
      >
        <Input
          value={name}
          label="Image name"
          placeholder="Short descriptive name for the image"
          onChange={handleNameInputChange}
        ></Input>
      </Modal>
    </div>
  );
}

export default App;
