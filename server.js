require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
var cors = require('cors');
const path = require("path");
const app = express();
app.use(cors());
const axios = require("axios");

const { restraunts_url, host_url } = require("./src/config");

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
  const url = `${host_url}webroutes/getPage?page_url=${region}/${name}/order&location=&isMobile=0`;
  const response = await axios
    .get(url, { headers })
    .catch((err) => console.error(`axios error is ${err.message}`));

  res.send(response.data);
});

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});


app.listen(process.env.PORT || 8080);
