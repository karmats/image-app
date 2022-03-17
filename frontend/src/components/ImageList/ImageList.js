import React from "react";
import "./ImageList.css";

function ImageList({ images }) {
  return (
    <div className="ImageList">
      {images.map((image) => (
        <figure key={image._id} className="ImageList-item">
          <img src={image.src} alt={image.name}></img>
          <figcaption>{image.name}</figcaption>
        </figure>
      ))}
    </div>
  );
}

export default ImageList;
