import { gql } from "@apollo/client";

const GET_UNSPLASH_IMAGES = gql`
	query unsplashImages($pageNum: Int) {
		unsplashImages(pageNum: $pageNum) {
			id
			url
			posterName
			description
			binned
		}
	}
`;

const GET_BINNED_IMAGES = gql`
	query binnedImages {
		binnedImages {
			id
			url
			posterName
			description
			binned
		}
	}
`;

const GET_USER_POSTED_IMAGES = gql`
	query userPostedImages {
		userPostedImages {
			id
			url
			posterName
			description
			userPosted
			binned
		}
	}
`;

const GET_LIKED_IMAGES = gql`
	query getTopTenBinnedPosts {
		getTopTenBinnedPosts {
			id
			url
			posterName
			description
			numBinned
		}
	}
`;

const ADD_TO_BIN = gql`
	mutation addToBin(
		$id: String!
		$url: String!
		$posterName: String
		$description: String
		$binned: Boolean
	) {
		addToBin(
			id: $id
			url: $url
			posterName: $posterName
			description: $description
			binned: $binned
		)
	}
`;
const UPLOAD_IMAGE = gql`
	mutation uploadImage(
		$url: String!
		$description: String!
		$posterName: String!
	) {
		uploadImage(url: $url, description: $description, posterName: $posterName) {
			id
			url
			posterName
			description
			userPosted
			binned
		}
	}
`;
const UPDATE_IMAGE = gql`
	mutation updateImage(
		$id: ID!
		$url: String!
		$posterName: String
		$description: String
		$userPosted: Boolean
		$binned: Boolean
	) {
		updateImage(
			id: $id
			url: $url
			posterName: $posterName
			description: $description
			userPosted: $userPosted
			binned: $binned
		) {
			id
			url
			posterName
			description
			userPosted
			binned
		}
	}
`;

const DELETE_IMAGE = gql`
	mutation DeleteImage($id: ID!) {
		deleteImage(id: $id) {
			id
			url
			posterName
			description
			userPosted
			binned
		}
	}
`;

export default {
	GET_UNSPLASH_IMAGES,
	GET_BINNED_IMAGES,
	GET_USER_POSTED_IMAGES,
	GET_LIKED_IMAGES,
	ADD_TO_BIN,
	UPLOAD_IMAGE,
	UPDATE_IMAGE,
	DELETE_IMAGE,
};
