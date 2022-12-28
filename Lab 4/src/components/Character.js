import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Error from "./Error";
import {
	Card,
	makeStyles,
	CardHeader,
	CardMedia,
	CardContent,
} from "@material-ui/core";
import noImage from "../img/download.jpeg";

const publickey = process.env.REACT_APP_PUBLIC_KEY;
const privatekey = process.env.REACT_APP_PRIVATE_KEY;

const md5 = require("blueimp-md5");
const ts = new Date().getTime();
const stringToHash = ts + privatekey + publickey;
const hash = md5(stringToHash);
const baseUrl = "https://gateway.marvel.com:443/v1/public/characters/";

	const useStyles = makeStyles({
	card: {
		maxWidth: 500,
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
function Character(props) {
	let test = props.match.params.id;
	const classes = useStyles();
	const [characterData, setCharacterData] = useState();
	const [loading, setLoading] = useState(true);
	const [check, setCheck] = useState(true);

	const urlforindiv =
		baseUrl +
		props.match.params.id +
		"?ts=" +
		ts +
		"&apikey=" +
		publickey +
		"&hash=" +
		hash;

	useEffect(() => {
		async function fetchData() {
			try {
				const {
					data: {
						data: { results },
					},
				} = await axios.get(urlforindiv);
				setCharacterData(results);
				setLoading(false);
			} catch (e) {
				console.log(e);
				setCheck(false);
			}
		}
		fetchData();
	}, [props.match.params.id, urlforindiv]);

	if (isNaN(test)) {
		return <Error />;
	}
	if (check === false) {
		return <Error />;
	}
	if (loading) {
		return (
			<div>
				<h1>Loading....</h1>
			</div>
		);
	} else {
		return (
			<Card className={classes.card} variant="outlined">
				{characterData &&
					characterData.map((data) => {
						let featuredComicsData = data.comics.items;
						let fcd1 =
							featuredComicsData &&
							featuredComicsData.map((x) => {
								var splitUrl = x.resourceURI.split("/");

								return (
									<Link key={splitUrl[6]} to={`/comics/${splitUrl[6]}`}>
										{x.name} <br />
									</Link>
								);
							});
						let featuredseriesData = data.series.items;
						let fsd1 =
							featuredseriesData &&
							featuredseriesData.map((x) => {
								var splitUrl = x.resourceURI.split("/");

								return (
									<Link key={splitUrl[6]} to={`/series/${splitUrl[6]}`}>
										{x.name} <br />
									</Link>
								);
							});

						return (
							<div key={data.id}>
								<CardHeader className={classes.titleHead} title={data.name} />
								<CardMedia
									className={classes.media}
									component="img"
									image={
										data.thumbnail &&
										data.thumbnail.path + "." + data.thumbnail.extension
											? data.thumbnail.path + "." + data.thumbnail.extension
											: noImage
									}
									title="show image"
								/>
								<CardContent>
									<dl>
										<dt className="title">Comics Available:</dt>
										{data.comics && data.comics.available ? (
											<dd>{data.comics.available} </dd>
										) : (
											<dd>NA</dd>
										)}

										<dt className="title">Series Available:</dt>
										{data.comics && data.series.available ? (
											<dd>{data.series.available} </dd>
										) : (
											<dd>NA</dd>
										)}

										<dt className="title">Stories Available:</dt>
										{data.comics && data.stories.available ? (
											<dd>{data.stories.available} </dd>
										) : (
											<dd>NA</dd>
										)}

										<dt className="title">Events Available:</dt>
										{data.comics && data.events.available ? (
											<dd>{data.events.available} </dd>
										) : (
											<dd>NA</dd>
										)}

										<dt className="title">Description:</dt>
										{data.comics && data.description ? (
											<dd>{data.description} </dd>
										) : (
											<dd>NA</dd>
										)}

										<dt className="title">Featured Comics Listing:</dt>
										{data.comics && data.comics ? (
											<dd> {fcd1} </dd>
										) : (
											<dd>NA</dd>
										)}

										<dt className="title">Featured Series Listing:</dt>
										{data.series && data.series ? (
											<dd> {fsd1} </dd>
										) : (
											<dd>NA</dd>
										)}
									</dl>
									<Link to="/characters/page/0">Back to all Characters...</Link>
								</CardContent>
							</div>
						);
					})}
			</Card>
		);
	}
}

export default Character;
