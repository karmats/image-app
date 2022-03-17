const fs = require("fs");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const dropAllCollections = require("./utils/dropAllCollections");

const request = supertest(app);

const fakeDate = 1647507125593;
const dateNowFn = Date.now.bind(global.Date);

const testImageName = "#Testar åäö och längd på filnamn";
const expectedFilePath = `/img/testar-aao_${fakeDate}.jpeg`;

// Connects to test database
beforeAll(async () => {
  process.env.ENV = "test";
  const url = `mongodb://127.0.0.1/image-app-test-db`;
  await mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  global.Date.now = jest.fn(() => fakeDate);
});

// Clean up test database and drop connection
afterAll(async () => {
  await dropAllCollections();
  await mongoose.connection.close();

  global.Date.now = dateNowFn;
});

test("Return 404 for invalid endpoint", async (done) => {
  const response = await request.get("/invalid");
  expect(response.status).toBe(404);
  expect(response.body.message).toBe(`Cannot find /invalid on this server!`);
  done();
});

test("POST /images - upload image", async (done) => {
  const response = await request
    .post("/images")
    .field("name", testImageName)
    .attach("photo", "test/utils/test.jpeg");

  const fileExists = fs.existsSync(`public${expectedFilePath}`);

  // Clean up by removing file again
  if (fileExists) {
    fs.unlink(`public${expectedFilePath}`, (err) => {
      if (err) throw err;
    });
  }

  expect(response.status).toBe(201);
  expect(response.body.data.name).toBe(testImageName);
  expect(response.body.data.path).toBe(expectedFilePath);
  expect(fileExists).toBe(true);

  done();
});

test("GET /images - returns array of metadata for uploaded images", async (done) => {
  const response = await request.get("/images");

  expect(response.status).toBe(200);
  expect(response.body.data.length).toBe(1);
  expect(response.body.data[0].name).toBe(testImageName);
  expect(response.body.data[0].path).toBe(expectedFilePath);

  done();
});
