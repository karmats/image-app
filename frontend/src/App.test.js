import React from "react";
import { findByText, fireEvent, render, waitFor } from "@testing-library/react";
import App from "./App";

const testImages = [
  { _id: "1", name: "Some name", path: "/some/path.jpeg" },
  { _id: "2", name: "Some other name", path: "/some/other-path.png" },
];
const testUploadImage = {
  _id: "3",
  name: "Uploaded image",
  path: "/some/uploaded.png",
};
let mockGetImagesResponse = Promise.resolve(testImages);
let mockPostImageResponse = Promise.resolve(testUploadImage);
jest.mock("./apis/imageUploadApi", () => ({
  getImages: () => mockGetImagesResponse,
  postImage: () => mockPostImageResponse,
}));

describe("App", () => {
  it("renders header", async () => {
    const { findByText } = render(<App />);
    const title = await findByText(/Image Uploading App/i);
    expect(title).toBeInTheDocument();
  });
});

describe("Image list", () => {
  beforeEach(() => {
    mockGetImagesResponse = Promise.resolve(testImages);
  });

  it("loades images", async () => {
    const { findByAltText } = render(<App />);

    const imageAlt1 = await findByAltText(testImages[0].name);
    const imageAlt2 = await findByAltText(testImages[0].name);

    expect(imageAlt1).toBeInTheDocument();
    expect(imageAlt2).toBeInTheDocument();
  });

  it("displays error message if messages fails to load", async () => {
    mockGetImagesResponse = Promise.reject("Failed to load images");

    const { findByRole } = render(<App />);

    const alert = await findByRole("alert");

    expect(alert).toBeInTheDocument();
  });

  describe("Upload image", () => {
    let app;

    const uploadFileProvideNameAndConfirm = async (name = "") => {
      const fileInput = await app.findByLabelText(/Upload/i);
      fireEvent.change(fileInput, {
        target: {
          files: [
            new File(["bytes"], "upload-file.png", { type: "image/png" }),
          ],
        },
      });

      if (name) {
        const nameInput = await app.findByLabelText(/Image name/i);
        fireEvent.change(nameInput, { target: { value: name } });
      }
      const okButton = await app.findByText(/Ok/i);
      fireEvent.click(okButton);
    };

    beforeEach(async () => {
      mockPostImageResponse = Promise.resolve(testUploadImage);

      app = render(<App />);
    });

    it("uploads image and displays it", async () => {
      uploadFileProvideNameAndConfirm("Some name");

      const newImage = await app.findByAltText(testUploadImage.name);

      expect(newImage).toBeInTheDocument();
    });

    it("displays error if name input is not provided", async () => {
      uploadFileProvideNameAndConfirm();

      const alert = await app.findByRole("alert");
      expect(alert).toBeInTheDocument();
    });

    it("displays error if upload fails", async () => {
      mockPostImageResponse = Promise.reject("Error uploading image");
      uploadFileProvideNameAndConfirm("Some name");

      const alert = await app.findByRole("alert");
      expect(alert).toBeInTheDocument();
    });
  });
});
