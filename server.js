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
// app.use(cors());  

const axios = require("axios");
// Add a request interceptor
// axios.interceptors.request.use(function (config) {
//   console.log('**********************************');
//   console.log({config});
//   return config;
// }, function (error) {
//   return Promise.reject(error);
// });

// // Add a response interceptor
// axios.interceptors.response.use(function (response) {
//   console.log('-------------------------------------');
//   console.log(response)
//   return response;
// }, function (error) {
//   return Promise.reject(error);
// });


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
  // const url = 'https://www.swiggy.com/dapi/menu/v4/full?lat=28.4594965&lng=77.0266383&menuId=94818';
  const url = `${host_url}/webroutes/getPage?page_url=${region}/${name}/order&location=&isMobile=0`;
  const response = await axios
    .get(url)
    .catch((err) => console.log(`${err.response}`));
  res.send(response.data);
});

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

const port = process.env.PORT || 8083;

app.listen(port, () => console.log(`Server running on port ${port}`));
