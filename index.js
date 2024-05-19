require("dotenv").config();
const axios = require("axios");
const { Client } = require("pg");
const { google } = require("googleapis");
const fs = require("fs").promises;
const path = require("path");
const { log } = require("console");

const customsearch = google.customsearch("v1");

async function fetchImageUrls(query, numImages) {
  console.log(`Searching for ${query} images please wait a few second...`);
  const res = await customsearch.cse.list({
    auth: process.env.GOOGLE_API_KEY,
    cx: process.env.GOOGLE_CSE_ID,
    q: query,
    searchType: "image",
    num: numImages,
  });
  return res.data.items.map((item) => item.link);
}

async function downloadImage(url, filename) {
  console.log("Trying to download the images");
  const response = await axios({
    url,
    responseType: "arraybuffer",
  });
  await fs.writeFile(filename, response.data);
  return response.data.toString("base64");
}

async function storeImageData(imageData) {
  console.log("saving in database");
  console.log(process.env.PG_PASSWORD);
  const client = new Client({
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    database: process.env.PG_DATABASE,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
  });

  await client.connect();

  const query = "INSERT INTO images (image_data) VALUES ($1)";
  await client.query(query, [imageData]);

  await client.end();
}

async function main(query, numImages) {
  try {
    const imageUrls = await fetchImageUrls(query, numImages);

    for (let i = 0; i < imageUrls.length; i++) {
      const url = imageUrls[i];
      const filename = path.join(__dirname, `image_${i}.jpg`);
      const imageData = await downloadImage(url, filename);
      await storeImageData(imageData);
      console.log(`Image ${i + 1} stored successfully.`);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

const query = process.argv[2] || "cute kittens";
const numImages = parseInt(process.argv[3], 10) || 3;

main(query, numImages);
