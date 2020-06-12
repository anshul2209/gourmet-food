if (process.env.NODE_ENV !== "production") require("dotenv").config();

const { restraunts_url, host_url } = require("./src/config");
const cors = require("cors");
const express = require("express");
const path = require("path");
const app = express();

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
  const { region, name } = req.query;
  // const url = 'https://www.swiggy.com/dapi/menu/v4/full?lat=28.4594965&lng=77.0266383&menuId=94818';
  const url = `${host_url}/webroutes/getPage?page_url=${region}/${name}/order&location=&isMobile=0`;
  const response = await axios.get(url).catch((err) => {
    console.log(`axios error is ${err.message}`);
    res.send(err);
  });
  res.send(response.data);
});

app.get('/api/testswiggy', async(req, res) => {
  const url = 'https://www.swiggy.com/dapi/menu/v4/full?lat=28.4594965&lng=77.0266383&menuId=51766';
  const response = await axios.get(url).catch((err) => {
    console.log(`axios error is ${err.message}`);
    res.send(err);
  });
  res.send(response.data);
})

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`Server running on port ${port}`));
