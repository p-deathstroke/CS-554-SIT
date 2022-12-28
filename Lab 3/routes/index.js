const showsRoutes = require("./shows");

const constructorMethod = (app) => {
	app.use("/", showsRoutes);
	app.use("*", (req, res) => {
		return res
			.status(404)
			.render("screen/error", { title: "No such page found" });
	});
};

module.exports = constructorMethod;
