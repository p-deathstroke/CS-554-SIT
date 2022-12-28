const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");

const configRoutes = require("./routes");

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
	session({
		name: "lab1",
		secret: "This is a secret.. shhh don't tell anyone",
		saveUninitialized: true,
		resave: false,
		cookie: { maxAge: 6000000 },
	})
);

app.use("/blog/signup", (req, res, next) => {
	if (!req.session.user) {
		next();
	} else {
		return res.status(400).json({ message: "Already loggedIn - signup error" });
	}
});

app.use("/blog/login", (req, res, next) => {
	if (!req.session.user) {
		next();
	} else {
		return res.status(400).json({ message: "Already loggedIn - loggin error" });
	}
});

app.put("/blog/:id", (req, res, next) => {
	if (!req.session.user) {
		return res.status(400).json({ message: "First logIn -  id put error" });
	} else {
		next();
	}
});
app.patch("/blog/:id", (req, res, next) => {
	if (!req.session.user) {
		return res.status(400).json({ message: "First logIn -  id patch error" });
	} else {
		next();
	}
});
app.use("/blog/:id/comments", (req, res, next) => {
	if (!req.session.user) {
		return res.status(400).json({ message: "First logIn -  id error comment" });
	} else {
		next();
	}
});
app.delete("/blog/:blogId/:commentId", (req, res, next) => {
	if (!req.session.user) {
		return res
			.status(400)
			.json({ message: "First logIn -  id  comment delte error" });
	} else {
		next();
	}
});
configRoutes(app);

app.listen(3000, () => {
	console.log("We've now got a server!");
	console.log("Your routes will be running on http://localhost:3000");
});
