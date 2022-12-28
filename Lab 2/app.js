const express = require("express");
const app = express();
const path = require("path");

const static = express.static(__dirname + "/public");
app.use("/public", static);

app.get("/", (req, res) => {
	res.sendFile(path.resolve("public/index.html"));
});

app.get("*", (req, res) => {
	res.json({ message: "Not found" });
});

app.listen(3000, () => {
	console.log("We've now got a server!");
	console.log("Your routes will be running on http://localhost:3000");
});
