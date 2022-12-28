const blog = require("./blogs");

const constructorMethod = (app) => {
	app.use("/blog", blog);

	app.use("*", (req, res) => {
		return res.status(404).json({ error: "Not found" });
	});
};

module.exports = constructorMethod;
