const express = require("express");
const rpio = require("rpio");
const app = express();

const path = require("path");

// rpio.open(36, rpio.OUTPUT, rpio.HIGH)

const openedPins = [];

app.get("/", (req, res) => {});
app.use("/static", express.static(path.join(__dirname, "./static")));

app.get("/api/blink/");

app.listen(8900, () => console.log("server running at port 8900!"));
