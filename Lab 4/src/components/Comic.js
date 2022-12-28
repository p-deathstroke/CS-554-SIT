import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
	Card,
	makeStyles,
	CardHeader,
	CardMedia,
	CardContent,
} from "@material-ui/core";
import noImage from "../img/download.jpeg";
import Error from "./Error";

const publickey = process.env.REACT_APP_PUBLIC_KEY;
const privatekey = process.env.REACT_APP_PRIVATE_KEY;

const md5 = require("blueimp-md5");
const ts = new Date().getTime();
const stringToHash = ts + privatekey + publickey;
const hash = md5(stringToHash);
const baseUrl = "https://gateway.marvel.com:443/v1/public/comics/";

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

function Comic(props) {
	let test = props.match.params.id;
	const classes = useStyles();
	const [comicData, setComicData] = useState();
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
				setComicData(results);
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
				{comicData &&
					comicData.map((data) => {
						let featuredChractersData = data.characters.items;
						let fcd1 =
							featuredChractersData &&
							featuredChractersData.map((x) => {
								var splitUrl = x.resourceURI.split("/");
								return (
									<Link key={splitUrl[6]} to={`/characters/${splitUrl[6]}`}>
										{x.name} <br />
									</Link>
								);
							});
						let fsd1 = data.series.resourceURI.split("/");
						return (
							<div key={data.id}>
								<CardHeader className={classes.titleHead} title={data.title} />
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
										<dt className="title">Creators Available:</dt>
										{data.creators && data.creators.available ? (
											<dd>{data.creators.available} </dd>
										) : (
											<dd>NA</dd>
										)}
										<dt className="title">Chracters Available:</dt>
										{data.characters && data.characters.available ? (
											<dd>{data.characters.available} </dd>
										) : (
											<dd>NA</dd>
										)}

										<dt className="title">Stories Available:</dt>
										{data.stories && data.stories.available ? (
											<dd>{data.stories.available} </dd>
										) : (
											<dd>NA</dd>
										)}

										<dt className="title">Events Available:</dt>
										{data.events && data.events.available ? (
											<dd>{data.events.available} </dd>
										) : (
											<dd>NA</dd>
										)}

										<dt className="title">Featured Characters Listing:</dt>
										{data.characters && data.characters.available ? (
											<dd> {fcd1} </dd>
										) : (
											<dd>NA</dd>
										)}
										<dt className="title">Featured Series </dt>
										{data.series && data.characters ? (
											<dd>
												<Link key={fsd1[6]} to={`/series/${fsd1[6]}`}>
													{data.series.name} <br />
												</Link>
											</dd>
										) : (
											<dd>NA</dd>
										)}
									</dl>
									<Link to="/comics/page/0">Back to all Comics...</Link>
								</CardContent>
							</div>
						);
					})}
			</Card>
		);
	}
}

export default Comic;