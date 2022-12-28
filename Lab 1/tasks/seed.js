const dbConnection = require("../config/mongoConnection");
const data = require("../data");
const blogs = data.blogs;

async function main() {
	const db = await dbConnection();
	await db.dropDatabase();

	const user1 = await blogs.createUser(
		"Preet",
		"Preet_deathstroke",
		"preet1997"
	);
	await blogs.createBlog(
		"Title:This is blog 1",
		"Body:This is blog 1",
		user1,
		[]
	);
	await blogs.createBlog(
		"Title:This is blog 2",
		"Body:This is blog 2",
		user1,
		[]
	);
	await blogs.createBlog(
		"Title:This is blog 3",
		"Body:This is blog 3",
		user1,
		[]
	);
	await blogs.createBlog(
		"Title:This is blog 4",
		"Body:This is blog 4",
		user1,
		[]
	);
	await blogs.createBlog(
		"Title:This is blog 5",
		"Body:This is blog 5",
		user1,
		[]
	);

	console.log("Done seeding database");

	await db.serverConfig.close();
}

main();
