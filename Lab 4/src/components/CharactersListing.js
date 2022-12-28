import React, { useState, useEffect } from "react";
import axios from "axios";
import Search from "./Search";
import { Link } from "react-router-dom";
import noImage from "../img/download.jpeg";
import Error from "./Error";
import {
	Card,
	CardActionArea,
	CardContent,
	CardMedia,
	Grid,
	Typography,
	makeStyles,
} from "@material-ui/core";

const publickey = process.env.REACT_APP_PUBLIC_KEY;
const privatekey = process.env.REACT_APP_PRIVATE_KEY;

const md5 = require("blueimp-md5");
const ts = new Date().getTime();
const stringToHash = ts + privatekey + publickey;
const hash = md5(stringToHash);
const baseUrl = "https://gateway.marvel.com:443/v1/public/characters";

const useStyles = makeStyles({
	card: {
		maxWidth: 250,
		height: "auto",
		marginLeft: "auto",
		marginRight: "auto",
		borderRadius: 5,
		border: "1px solid #1e8678",
		boxShadow: "0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);",
	},
	titleHead: {
		borderBottom: "1px solid #1e8678",
		fontWeight: "bold",
	},
	grid: {
		flexGrow: 1,
		flexDirection: "row",
	},
	media: {
		height: "100%",
		width: "100%",
	},
	button: {
		color: "#1e8678",
		fontWeight: "bold",
		fontSize: 12,
	},
});

const CharactersListing = (props) => {
	let test = props.match.params.page;
	let limit = 100;
	if (test === null || !test) {
		test = 0;
	}
	const classes = useStyles();
	const [charactersData, setCharactersData] = useState();
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(Number(test));
	const [searchTerm, setSearchTerm] = useState("");
	const [searchData, setSearchData] = useState(undefined);
	const [lspg, setLspg] = useState(false);
	const [offSet, setOffSet] = useState(test * limit);

	const urlforlisting =
		baseUrl +
		"?limit=" +
		limit +
		"&offset=" +
		offSet +
		"&ts=" +
		ts +
		"&apikey=" +
		publickey +
		"&hash=" +
		hash;

	const urlforsearch =
		baseUrl +
		"?limit=" +
		limit +
		"&nameStartsWith=" +
		searchTerm +
		"&ts=" +
		ts +
		"&apikey=" +
		publickey +
		"&hash=" +
		hash;
	let card = null;
	const [check, setCheck] = useState(true);
	useEffect(() => {
		async function fetchData() {
			try {
				const {
					data: {
						data: { results, total, count },
					},
				} = await axios.get(urlforlisting);
				console.log(urlforlisting)
				if (results) {
					setCharactersData(results);
					setLoading(false);
					setLspg(false);
				}
				if (results.length === 0) {
					setCheck(false);
				}
				if (total < offSet || count < limit) {
					setLspg(true);
				}
			} catch (e) {
				console.log(e);
			}
		}
		fetchData();
	}, [page, urlforlisting, limit, offSet]);

	const incr = () => {
		setOffSet(offSet + 100);
		setPage(page + 1);
	};
	const decr = () => {
		setPage(page - 1);
		setOffSet(offSet - 100);
	};

	useEffect(() => {
		async function fetchData() {
			try {
				const {
					data: {
						data: { results },
					},
				} = await axios.get(urlforsearch);
				setSearchData(results);
				setLoading(false);
			} catch (e) {
				console.log(e);
			}
		}
		if (searchTerm) {
			fetchData();
		}
	}, [searchTerm, urlforsearch]);

	const searchValue = async (value) => {
		setSearchTerm(value);
	};
	const buildCard = (characters) => {
		return (
			<Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={characters.id}>
				<Card className={classes.card} variant="outlined">
					<CardActionArea>
						<CardMedia
							className={classes.media}
							component="img"
							image={
								characters.thumbnail &&
								characters.thumbnail.path + "." + characters.thumbnail.extension
									? characters.thumbnail.path +
									  "." +
									  characters.thumbnail.extension
									: noImage
							}
							title="characters image"
						/>
					</CardActionArea>
					<Link to={`/characters/${characters.id}`}>
						<CardContent>
							<Typography
								className={classes.titleHead}
								gutterBottom
								variant="h6"
								component="h1"
							>
								{characters.name}
							</Typography>
							<Typography variant="body2" color="textSecondary" component="p">
								Comics Available: {characters.comics.available}
								<br />
								Series Available: {characters.series.available}
								<br />
								Stories Available: {characters.stories.available}
								<br />
								Events Available: {characters.events.available}
								<br />
								<span>Click on Card for more info </span>
							</Typography>
						</CardContent>
					</Link>
				</Card>
			</Grid>
		);
	};

	if (isNaN(test)) {
		return <Error />;
	}
	if (check === false) {
		return <Error />;
	}
	if (searchTerm) {
		card =
			searchData &&
			searchData.map((characters) => {
				return buildCard(characters);
			});
	} else {
		card =
			charactersData &&
			charactersData.map((characters) => {
				return buildCard(characters);
			});
	}
	if (loading) {
		return (
			<div>
				<h1>Loading....</h1>
			</div>
		);
	} else {
		return (
			<div>
				<Search searchValue={searchValue} />
				<br />
				{page === 0 ? (
					""
				) : (
					<Link to={`/characters/page/${page - 1}`} onClick={decr}>
						PREV... <br />
					</Link>
				)}
				{lspg === true ? (
					""
				) : (
					<Link to={`/characters/page/${page + 1}`} onClick={incr}>
						NEXT...{" "}
					</Link>
				)}
				<br />
				<hr />
				<Grid container className={classes.grid} spacing={5}>
					{card}
				</Grid>
			</div>
		);
	}
};
export default CharactersListing;
