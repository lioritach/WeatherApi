const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(express.json());
app.use(cors());

const API_KEY = "ea0dbf96854e405faf3163126221602";
const URL = `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}`;

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/city/", async (req, res) => {
  const city = req.query.city;
  let result;

  try {
    result = await axios.get(URL + "&q=" + city + "&days=1&aqi=no&alerts=no");
    res.json(result.data);
  } catch (err) {
    res.status(400).send({ error: "Error" });
  }
});

app.listen("5000", () => {
  console.log("Backend is running");
});
