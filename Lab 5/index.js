const bluebird = require("bluebird");
const { ApolloServer, gql } = require("apollo-server");
const axios = require("axios");
const lodash = require("lodash");
const uuid = require("uuid");

const redis = require("redis");
const client = redis.createClient();

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const typeDefs = gql`
	type ImagePost {
		id: ID!
		url: String!
		posterName: String!
		description: String
		userPosted: Boolean!
		binned: Boolean!
		numBinned: Int!
	}
	type Query {
		unsplashImages(pageNum: Int): [ImagePost]
		binnedImages: [ImagePost]
		userPostedImages: [ImagePost]
		getTopTenBinnedPosts: [ImagePost]
	}
	type Mutation {
		addToBin(
			id: String
			url: String
			posterName: String
			description: String
			binned: Boolean
		): String
		uploadImage(
			url: String!
			description: String
			posterName: String
		): ImagePost
		updateImage(
			id: ID!
			url: String
			posterName: String
			description: String
			userPosted: Boolean
			binned: Boolean
		): ImagePost
		deleteImage(id: ID!): ImagePost
	}
`;
let uploadImage = [];
let binImages = [];
const client_id = "DA2whOjIfejAZ0_RHfTAGeg6jUEMktTDyvSbLHNmK08";
const resolvers = {
	Query: {
		unsplashImages: async (_, args) => {
			const { data } = await axios.get(
				`https://api.unsplash.com/photos?page=${args.pageNum}&client_id=${client_id}`
			);
			imgData = data.map((x) => {
				return {
					id: x.id,
					url: x.urls.raw,
					posterName: x.user.username,
					description: x.description,
					userPosted: false,
					binned: false,
				};
			});
			return imgData;
		},
		binnedImages: async () => {
			let test = await client.getAsync("binnedImages");
			let test1 = JSON.parse(test);
			return test1;
		},
		userPostedImages: async () => {
			let upi = await client.getAsync("userPostedImages");
			let upi1 = JSON.parse(upi);
			return upi1;
		},
	},
	Mutation: {
		addToBin: async (_, args) => {
			let binImages = await client.getAsync("binnedImages");
			if (binImages === null) {
				binImages = [];
			} else {
				binImages = JSON.parse(binImages);
			}
			binImages.push({
				id: args.id,
				url: args.url,
				description: args.description,
				posterName: args.posterName,
				binned: args.binned,
			});
			await client.setAsync("binnedImages", JSON.stringify(binImages));
			return "Binned Image";
		},
		uploadImage: async (_, args) => {
			let userPostedImages = await client.getAsync("userPostedImages");
			if (userPostedImages === null) {
				userPostedImages = [];
			} else {
				userPostedImages = JSON.parse(userPostedImages);
			}
			userPostedImages.push({
				id: uuid.v4(),
				url: args.url,
				description: args.description,
				posterName: args.posterName,
				binned: false,
				userPosted: true,
			});
			await client.setAsync(
				"userPostedImages",
				JSON.stringify(userPostedImages)
			);
			return "Uploded Image";
		},
		updateImage: async (_, args) => {
			let img = {
				id: args.id,
				url: args.url,
				posterName: args.posterName,
				description: args.description,
				userPosted: args.userPosted,
				binned: args.binned,
			};
			let upi = await client.getAsync("userPostedImages");
			upi.forEach((x) => {
				if ((upi[x].id = args.id)) {
				}
			});
			await client.setAsync("userPostedImages");
			await client.setAsync("binnedImages");
			return args.id + "updated";
		},
		deleteImage: async (_, args) => {
			// console.log("agrs" + args.id);
			let delupi = await client.getAsync("userPostedImages");
			delupi = JSON.parse(delupi);
			delupi.forEach((i) => {
				if (i.id === args.id) {
					// console.log(i.id);
					delupi.splice(i, 1); // from github
				}
			});
			await client.setAsync("userPostedImages", JSON.stringify(delupi));
		},
	},
};
const server = new ApolloServer({ typeDefs, resolvers });
server.listen().then(({ url }) => {
	console.log(`🚀  Server ready at ${url} 🚀`);
});
