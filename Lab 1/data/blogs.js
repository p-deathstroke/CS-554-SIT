const mongoCollections = require("../config/mongoCollections");
let { ObjectId } = require("mongodb");
const blogcoll = mongoCollections.blogs;
const usercoll = mongoCollections.users;
const commentcoll = mongoCollections.comments;
const bcrypt = require("bcryptjs");
const saltRounds = 10;

const exportedMethods = {
	async createBlog(title, body, userThatPosted, comments) {
		try {
			if (!title || !body || !userThatPosted || !comments)
				throw "One of the input paramertes are missing";

			if (!Array.isArray(comments)) {
				comments = [];
			}
			const blogsCollection = await blogcoll();

			let newBlog = {
				title: title,
				body: body,
				userThatPosted: userThatPosted, // object
				comments: [], // array of objects
			};

			const insertInfo = await blogsCollection.insertOne(newBlog);
			if (insertInfo.insertedCount === 0) throw "Could not add blog";

			const newId = insertInfo.insertedId;
			let blog = await this.getBlogById(newId.toString());
			blog._id = blog._id.toString();
			return blog;
		} catch (e) {
			return;
		}
	},
	async getBlogById(id) {
		if (!id) throw "Please provide a proper ID ";
		if (typeof id != "string") throw "Please provide a String based ID";
		if (id.trim().length === 0) throw "Input ID cannot be blank";
		let parsedId = ObjectId(id);
		const blogsCollection = await blogcoll();
		let blog = await blogsCollection.findOne({ _id: parsedId });

		if (blog === null) throw "blog not found";
		return blog;
	},
	async getAllBlogs(x = 0, y = 20) {
		y = Number(y);
		x = Number(x);
		if (typeof x != "number") throw "Please provide a Number";
		if (typeof y != "number") throw "Please provide a Number";
		if (y > 100) {
			y = 20;
		}
		const blogsCollection = await blogcoll();
		return await blogsCollection.find({}).limit(y).skip(x).toArray();
	},

	async createUser(name, username, password) {
		if (!name || !username || !password)
			throw "One of the input paramertes are missing";
		const userCollection = await usercoll();

		const hashedPassword = await bcrypt.hash(password, saltRounds);

		let newUser = {
			name: name,
			username: username,
			password: hashedPassword,
		};
		const insertInfo = await userCollection.insertOne(newUser);
		if (insertInfo.insertedCount === 0) throw "Could not add user";

		const newId = insertInfo.insertedId;
		let user = await this.getUserById(newId.toString());
		const usertest = {
			_id: user._id,
			name: user.name,
			username: user.username,
		};
		user._id = user._id.toString();
		return usertest;
	},
	async getAllUsers() {
		const userCollection = await usercoll();
		return await userCollection.find({}).toArray();
	},
	async getUserById(id) {
		if (!id) throw "Please provide a proper ID ";
		if (typeof id != "string") throw "Please provide a String based ID";
		if (id.trim().length === 0) throw "Input ID cannot be blank";
		let parsedId = ObjectId(id);
		const userCollection = await usercoll();
		let user = await userCollection.findOne({ _id: parsedId });

		if (user === null) throw "user not found";
		return user;
	},
	async createComment(id, userthatpostedcomment, comment) {
		try {
			if (typeof id != "string") throw "Please provide a String based ID";
			if (id.trim().length === 0) throw "Input ID cannot be blank";
			if (comment === undefined || comment.trim() === "")
				throw "Please provide a comment";
			if (!id || !userthatpostedcomment || !comment)
				throw "One of the input paramertes are missing";

			let parsedId = ObjectId(id);
			let newComment = {
				_id: ObjectId(),
				userThatPostedComment: userthatpostedcomment, // object
				comment: comment, // array of objects
			};
			const blogsCollection = await blogcoll();
			let blog = await blogsCollection.updateOne(
				{ _id: parsedId },
				{ $addToSet: { comments: newComment } }
			);

			const currentBlog = await this.getBlogById(id);
			return currentBlog;
		} catch (e) {
			return;
		}
	},
	async getCommentById(id) {
		if (!id) throw "Please provide a proper ID ";
		if (typeof id != "string") throw "Please provide a String based ID";
		if (id.trim().length === 0) throw "Input ID cannot be blank";

		let parsedId = ObjectId(id);
		const commentsCollection = await commentcoll();
		let comment = await commentsCollection.findOne({ _id: parsedId });

		if (comment === null) throw "comment not found";
		return comment;
	},

	async deleteComment(blogId, commentId, userData) {
		if (!blogId) throw "Please provide blog id";
		if (!commentId) throw "Please provide comment id";
		let parsedblogId = ObjectId(blogId);
		let parsedcommentId = ObjectId(commentId);

		let blog = await this.getBlogById(blogId.toString());
		let test1 = false;
		commentscoll = blog.comments;

		commentscoll.forEach(async (element) => {
			if (element._id.toString() === commentId.toString()) {
				if (element.userThatPostedComment.username === userData.username) {
					test1 = true;
					const blogsCollection = await blogcoll();
					await blogsCollection.updateOne(
						{ _id: parsedblogId },
						{ $pull: { comments: { _id: parsedcommentId } } }
					);
					const currentBlog = await this.getBlogById(blogId);
					return currentBlog;
				}
			}
		});

		if (test1 === false) {
			throw " No auth to delete this comment";
		}
	},

	async updateBlog(id, updatedBlogData) {
		const blogsCollection = await blogcoll();
		// if (
		// 	updatedBlogData.title === undefined ||
		// 	updatedBlogData.title.trim() === ""
		// )
		// 	throw "Please provide a title";
		// if (
		// 	updatedBlogData.body === undefined ||
		// 	updatedBlogData.body.trim() === ""
		// )
		// 	throw "Please provide a body";
		let updatedBlog = {};
		if (updatedBlogData.title) {
			updatedBlog.title = updatedBlogData.title;
		}
		if (updatedBlogData.body) {
			updatedBlog.body = updatedBlogData.body;
		}
		await blogsCollection.updateOne(
			{ _id: ObjectId(id) },
			{ $set: updatedBlog }
		);
		return await this.getBlogById(id);
	},
	async checkUserForblog(userdata, blogId) {
		let blog = await this.getBlogById(blogId.toString());
		if (userdata.username === blog.userThatPosted.username) {
			return true;
		} else {
			return false;
		}
	},
};

module.exports = exportedMethods;
