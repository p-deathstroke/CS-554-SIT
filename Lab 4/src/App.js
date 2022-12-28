import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import CharactersListing from "./components/CharactersListing";
import Home from "./components/Home";
import ComicsListing from "./components/ComicsListing";
import SeriesListing from "./components/SeriesListing";
import Character from "./components/Character";
import Comic from "./components/Comic";
import Series from "./components/Series";
import Error from "./components/Error";

function App() {
	return (
		<Router>
			<div className="App">
				<div className="App-body">
					<Switch>
						<Route exact path="/" component={Home} />
						<Route
							exact
							path="/characters/page/:page"
							component={CharactersListing}
						/>
						<Route exact path="/characters/:id" component={Character} />
						<Route exact path="/comics/page/:page" component={ComicsListing} />
						<Route exact path="/comics/:id" component={Comic} />
						<Route exact path="/series/page/:page" component={SeriesListing} />
						<Route exact path="/series/:id" component={Series} />
						<Route exact path="*" component={Error} />
					</Switch>
				</div>
			</div>
		</Router>
	);
}

export default App;
