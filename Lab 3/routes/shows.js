const express = require("express");
const router = express.Router();
const data = require("../data");
const showsData = data.shows;
const axios = require("axios");

const bluebird = require("bluebird");
const redis = require("redis");
const client = redis.createClient();

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

router.get("/", async (req, res) => {
	try {
		let showdata = await showsData.getAllShows();
		res.render(
			"screen/listShows",
			{
				showdata: showdata,
				title: "List of shows",
				tag: "List of Shows",
			},
			async function (err, html) {
				try {
					await client.setAsync("rootHTML", html);
					res.send(html);
				} catch (error) {
					return res.send(error);
				}
			}
		);
	} catch (error) {
		return res.status(404).render("screen/error", {
			title: "No Such show Found",
			error: "show not found",
		});
	}
});
router.get("/show/:id", async (req, res) => {
	try {
		let showdata = await showsData.getShowById(req.params.id);
		// let image = showdata.image.medium;
		// console.log(image);
		// if (!image) {
		// 	image = await axios.get(
		// 		`https://static.tvmaze.com/images/no-img/no-img-portrait-text.png`
		// 	);
		// }
		let sum = showdata.summary
			.replace(/<[^>]*>/g, " ")
			.replace(/\s{2,}/g, " ")
			.trim();
		res.render(
			"screen/showDetails",
			{
				showdata,
				title: showdata.name,
				summary: sum,
				//image: image,
			},
			async function (err, html) {
				try {
					await client.setAsync(req.params.id, html);
					res.send(html);
				} catch (error) {
					return res.send(error);
				}
			}
		);
	} catch (error) {
		return res
			.status(404)
			.render("screen/error", { title: "No Such show Found" });
	}
});
router.post("/search", async (req, res) => {
	try {
		let searchData = await showsData.getShowBySearch(
			req.body.yolo.toLowerCase()
		);
		res.render(
			"screen/search",
			{
				searchData,
				search: req.body.yolo,
				title: "Shows Found",
			},
			async function (err, html) {
				try {
					await client.setAsync(req.body.yolo.toLowerCase(), html);
					res.send(html);
				} catch (error) {
					return res.send(error);
				}
			}
		);
	} catch (error) {
		return res
			.status(404)
			.render("screen/error", { title: "No Such show Found" });
	}
});
router.get("/popularsearches", async (req, res) => {
	try {
		let set = await client.zrevrangeAsync("searches", 0, 9);
		if (set.length === 0) {
			return res.status(404).send("No Searches made yet");
		}
		res.render("screen/popularSearches", {
			ps: set,
			title: "Popular Searches",
			tag: "List of Popular searches",
		});
	} catch (error) {
		return res
			.status(404)
			.render("screen/error", { title: "No Such show Found" });
	}
});
module.exports = router;
