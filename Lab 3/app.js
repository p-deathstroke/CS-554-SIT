const bluebird = require("bluebird");
const express = require("express");
const app = express();
const static = express.static(__dirname + "/public");

const flat = require("flat");
const unflatten = flat.unflatten;

const redis = require("redis");
const client = redis.createClient();

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const configRoutes = require("./routes");
const exphbs = require("express-handlebars");

app.use("/public", static);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//cache middleware
app.get("/", async (req, res, next) => {
	let checkRootPage = await client.existsAsync("rootHTML");
	if (checkRootPage) {
		let cacheRootPage = await client.getAsync("rootHTML");
		res.send(cacheRootPage);
	} else {
		next();
	}
});
app.get("/show/:id", async (req, res, next) => {
	let checkIdPage = await client.existsAsync(req.params.id);
	if (checkIdPage) {
		let cacheIdPage = await client.getAsync(req.params.id);
		res.send(cacheIdPage);
	} else {
		next();
	}
});
app.post("/search", async (req, res, next) => {
	if (req.body.yolo.trim().length === 0 || !req.body.yolo.trim()) {
		return res.render("screen/error", { title: "No Such Page Found" });
	}
	if ((await client.existsAsync("searches", req.body.yolo)) === null) {
		await client.zaddAsync("searches", 1, req.body.yolo.toLowerCase());
	} else {
		await client.zincrbyAsync("searches", 1, req.body.yolo.toLowerCase());
	}

	let checkSearchPage = await client.existsAsync(req.body.yolo.toLowerCase());
	if (checkSearchPage) {
		let cacheSearchPage = await client.getAsync(req.body.yolo.toLowerCase());
		res.send(cacheSearchPage);
	} else {
		next();
	}
});
configRoutes(app);

app.listen(3000, () => {
	console.log("We've now got a server!");
	console.log("Your routes will be running on http://localhost:3000");
});
