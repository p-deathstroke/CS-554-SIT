const express = require("express");
const router = express.Router();
const data = require("../data");
const blogData = data.blogs;
const bcrypt = require("bcryptjs");
const saltRounds = 10;

router.get("/", async (req, res) => {
	try {
		const blogDatas = await blogData.getAllBlogs(
			req.query.skip,
			req.query.take
		);
		return res.json(blogDatas);
	} catch (e) {
		return res.status(500).json({ error: e });
	}
});
router.get("/logout", async (req, res) => {
	req.session.destroy();
	res.json({ message: "you have been logged out" });
});
router.get("/:id", async (req, res) => {
	try {
		const blogGetId = await blogData.getBlogById(req.params.id);
		return res.json(blogGetId);
	} catch (e) {
		return res.status(404).json({ error: "Blog not found" });
	}
});

router.post("/", async (req, res) => {
	const reqID = req.session.user.userid;
	const reqUsername = req.session.user.username;
	const blogInfo = req.body;
	if (!blogInfo) {
		res.status(400).json({ error: "Please provide data to create a Blog" });
		return;
	}
	if (!blogInfo.title || blogInfo.title.trim() === null) {
		res.status(400).json({ error: "Please Provide Blog title" });
		return;
	}
	if (!blogInfo.body || blogInfo.body.trim() === null) {
		res.status(400).json({ error: "Please Provide Blog body" });
		return;
	}
	try {
		const { title, body } = blogInfo;

		const newBlog = await blogData.createBlog(
			title,
			body,
			{ _id: reqID, username: reqUsername },
			[]
		);
		return res.json(newBlog);
	} catch (e) {
		return res.status(500).json({ error: e });
	}
});
router.post("/login", async (req, res) => {
	try {
		const logInData = req.body;

		if (logInData.username === undefined || logInData.username.trim() === "") {
			throw {
				status: 400,
				error: "User name not passed",
			};
		}
		if (logInData.password === undefined || logInData.password.trim() === "") {
			throw {
				status: 400,
				error: "Password not passed",
			};
		}

		const usersDatas = await blogData.getAllUsers();
		usersDatas.forEach((element) => {
			if (element.username === logInData.username) {
				check = true;
				checkpassword = element.password;
				checkname = element.name;
				checkid = element._id;
				checkusername = element.username;
			}
		});

		if (check === true) {
			const match = await bcrypt.compare(logInData.password, checkpassword);

			if (match) {
				req.session.user = {
					userAuthenticated: true,
					username: logInData.username,
					userid: checkid,
				};
				newUser = {
					_id: checkid,
					name: checkname,
					username: checkusername,
				};
			}

			return res.json(newUser);
		} else {
			return res.status(500).json({ message: "User not found" });
		}
	} catch (e) {
		return res
			.status(500)
			.json({ error: e, message: "Catch error from login" });
	}
});
router.put("/:id", async (req, res) => {
	const updatedData = req.body;
	let check = await blogData.checkUserForblog(req.session.user, req.params.id);
	if (check === true) {
		if (!updatedData.title || !updatedData.body) {
			res.status(400).json({ error: "You must Supply All fields" });
			return;
		}
		try {
			await blogData.getBlogById(req.params.id);
		} catch (e) {
			res.status(404).json({ error: "Blog not found" });
			return;
		}

		try {
			const updatedBlog = await blogData.updateBlog(req.params.id, updatedData);
			return res.json(updatedBlog);
		} catch (e) {
			return res.status(500).json({ error: e });
		}
	} else {
		res.status(404).json({ error: "No Access to Edit Blog" });
		return;
	}
});

router.patch("/:id", async (req, res) => {
	const requestBody = req.body;
	let updatedObject = {};
	let check = await blogData.checkUserForblog(req.session.user, req.params.id);
	if (check === true) {
		try {
			const oldBlog = await blogData.getBlogById(req.params.id);
			if (requestBody.title && requestBody.title !== oldBlog.title)
				updatedObject.title = requestBody.title;
			if (requestBody.body && requestBody.body !== oldBlog.body)
				updatedObject.body = requestBody.body;
		} catch (e) {
			res.status(404).json({ error: "Blog not found" });
			return;
		}
		if (Object.keys(updatedObject).length !== 0) {
			try {
				const updatedBlog = await blogData.updateBlog(
					req.params.id,
					updatedObject
				);

				return res.json(updatedBlog);
			} catch (e) {
				return res.status(500).json({ error: e });
			}
		} else {
			return res.status(400).json({
				error:
					"No fields have been changed from their inital values, so no update has occurred",
			});
		}
	} else {
		res.status(404).json({ error: "No Access to Edit Blog" });
		return;
	}
});

router.post("/:id/comments", async (req, res) => {
	try {
		const reqID = req.session.user.userid;
		const reqUsername = req.session.user.username;
		let user = {
			_id: reqID,
			username: reqUsername,
		};
		const commentData = req.body;

		if (
			commentData.comment === undefined ||
			commentData.comment.trim() === ""
		) {
			throw {
				status: 400,
				error: " comment not passed",
			};
		}
		const test = await blogData.createComment(
			req.params.id,
			user,
			commentData.comment
		);
		return res.json(test);
	} catch (e) {
		return res.status(500).json({ error: e });
	}
});

router.delete("/:blogId/:commentId", async (req, res) => {
	try {
		// const blogGetId = await blogData.getBlogById(req.params.blogId);
		// console.log(blogGetId);

		await blogData.deleteComment(
			req.params.blogId,
			req.params.commentId,
			req.session.user
		);

		return res.json({ message: "Comment deleted" });
	} catch (e) {
		return res.status(500).json({ error: e });
	}
});

router.post("/signup", async (req, res) => {
	try {
		const signupData = req.body;
		if (signupData.name === undefined || signupData.name.trim() === "") {
			throw {
				status: 400,
				error: " name not passed",
			};
		}
		if (
			signupData.username === undefined ||
			signupData.username.trim() === ""
		) {
			throw {
				status: 400,
				error: "User name not passed",
			};
		}
		if (
			signupData.password === undefined ||
			signupData.password.trim() === ""
		) {
			throw {
				status: 400,
				error: "Password not passed",
			};
		}

		const { name, username, password } = signupData;
		const usersDatas = await blogData.getAllUsers();
		usersDatas.forEach((element) => {
			if (element.username === username) {
				return res.status().json({ message: "User already exists" });
			}
		});
		const newUser = await blogData.createUser(
			signupData.name,
			signupData.username,
			signupData.password
		);
		return res.json(newUser);
	} catch (e) {
		return res.status(500).json({ error: e });
	}
});

module.exports = router;
