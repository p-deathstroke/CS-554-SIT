const axios = require("axios");

const getAllShows = async () => {
	const { data } = await axios.get(`http://api.tvmaze.com/shows`);
	return data;
};

const getShowById = async (id) => {
	const showId = parseInt(id);
	if (typeof showId != "number") throw "Show not found";
	const { data } = await axios.get(`http://api.tvmaze.com/shows/${id}`);
	return data;
};

const getShowBySearch = async (search) => {
	if (search === undefined || search === null)
		throw "Search field value not provided.";
	const { data } = await axios.get(
		`http://api.tvmaze.com/search/shows?q=${search}`
	);
	return data;
};

module.exports = {
	getAllShows,
	getShowById,
	getShowBySearch,
};
