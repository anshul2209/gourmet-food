if (process.env.NODE_ENV !== "production") require("dotenv").config();

const { restraunts_url, host_url } = require("./src/config");
const cors = require("cors");
const express = require("express");
const path = require("path");
const app = express();

const restaurant_details_headers = {
  "x-access-uuid": "249b57ae-3adb-4eda-8b01-de0bd9b7fe68",
  "x-client-id": "ordering_sdk_fk_pwa_v1",
  "x-zomato-api-key": "f55a0ef8a9b721bf726285f81090e900",
  "x-zomato-ordering-api-key": "f55a0ef8a9b721bf726285f81090e900",
  "x-zomato-ordering-secret-key": "1e857e2cce68503fafd0643487b01d0a",
};

app.use(cors());

const axios = require("axios");

app.use(express.static(path.join(__dirname, "build")));

const headers = {
  "user-key": process.env.REACT_APP_USER_KEY,
};

app.get("/api/hello", (req, res) => res.send("hello"));

app.get("/api/allrestaurants", async (req, res) => {
  const response = await axios.get(restraunts_url, { headers }).catch((err) => {
    console.error(`axios error is ${err.message}`);
    res.send(err);
  });

  res.send(response.data);
});

app.get("/api/restaurant", async (req, res) => {
  const { restaurant_id } = req.query;
  const url = `https://api.zomato.com/order/restaurant/${restaurant_id}/menu-with-details`;

  const response = await axios
    .get(url, { headers: restaurant_details_headers })
    .catch((err) => {
      console.log(`axios error is ${err.message}`);
      res.send(err);
    });
  res.send(response.data);
});

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`Server running on port ${port}`));
