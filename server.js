require("dotenv").config();
const { restraunts_url, host_url } = require("./src/config");

const express = require("express");
const bodyParser = require("body-parser");
// var cors = require('cors');
const path = require("path");
const app = express();
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

const axios = require("axios");


app.use(express.static(path.join(__dirname, "build")));

const headers = {
  "user-key": process.env.REACT_APP_USER_KEY,
};

app.get("/api/allrestaurants", async (req, res) => {
  const response = await axios
    .get(restraunts_url, { headers })
    .catch((err) => console.error(`axios error is ${err.message}`));

  res.send(response.data);
});

app.get("/api/restaurant", async (req, res) => {
  const { region, name } = req.query;
  const url = `${host_url}/webroutes/getPage?page_url=${region}/${name}/order&location=&isMobile=0`;
  console.log(url);
  const response = await axios
    .get(url)
    .catch((err) => console.error(`axios error is ${err.message}`));

  res.send(response.data);
});

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});


app.listen(process.env.PORT || 8080);
