require("dotenv").config();
const { restraunts_url, host_url } = require("./src/config");
const cors = require('cors')
const express = require("express");
const path = require("path");
const app = express();
const origin = process.env.NODE_ENV === "development" ? 'http://localhost:3000' : 'https://foodiiee.herokuapp.com'
app.use(cors({
  origin,
}))

const axios = require("axios");


app.use(express.static(path.join(__dirname, "build")));

const headers = {
  "user-key": process.env.REACT_APP_USER_KEY,
};


app.get('/api/hello', async (req, res) => {
  const response = await axios.get('https://www.zomato.com/ncr');

  res.send(response.headers['set-cookie']);
})


app.get("/api/allrestaurants", async (req, res) => {
  const response = await axios
    .get(restraunts_url, { headers })
    .catch((err) => console.error(`axios error is ${err.message}`));

  res.send(response.data);
});

app.get("/api/restaurant", async (req, res) => {
  console.log(req.headers);
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
