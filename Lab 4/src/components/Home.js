import React from "react";
import logo from "../img/docstr.gif";
import { Link } from "react-router-dom";
function Home() {
	return (
		<div className="Home">
			<header className="App-header">
				{<img src={logo} className="App-logo" alt="logo" />}
				<h1 className="App-title">Welcome to Marvel API</h1>
				<h2>
					{" "}
					I am the Watcher. I am your guide through these vast new realities.
					Follow me and dare to face the unknown, and ponder the question...
					What if!
				</h2>
				<Link className="characterlistlink" to={"/characters/page/0"}>
					Characters Listing
				</Link>
				<Link className="comiclistlink" to={"/comics/page/0"}>
					Comics Listing
				</Link>
				<Link className="serieslistinglink" to={"/series/page/0"}>
					Series Listing
				</Link>
			</header>
		</div>
	);
}

export default Home;
