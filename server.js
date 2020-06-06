require("dotenv").config();
const { restraunts_url, host_url } = require("./src/config");
const cors = require("cors");
const express = require("express");
const path = require("path");
const app = express();
const origin =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://foodiiee.herokuapp.com";
app.use(cors({}));

const axios = require("axios");

app.use(express.static(path.join(__dirname, "build")));

const headers = {
  "user-key": process.env.REACT_APP_USER_KEY,
};

const headers_secret = {
  'x-zomato-ordering-secret-key': '1e857e2cce68503fafd0643487b01d0a',
  'x-zomato-ordering-api-key': 'f55a0ef8a9b721bf726285f81090e900',
  'x-zomato-api-key': 'f55a0ef8a9b721bf726285f81090e900',
  'x-access-uuid': '7da0c1bc-3800-4bba-aed8-7f0e79bfbc66'
}

app.get("/api/hello", async (req, res) => {
  const response = await axios.get("https://www.zomato.com/ncr");

  res.send(response.headers["set-cookie"]);
});

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
    .get(url, { headers: headers_secret})
    .catch((err) => console.error(`axios error is ${err.message}`));

  res.send(response.data);
});

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(process.env.PORT || 8080);
