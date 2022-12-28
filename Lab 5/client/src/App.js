import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route, NavLink } from "react-router-dom";
import Images from "./components/Images";
import MyBin from "./components/MyBin";
import MyPosts from "./components/MyPosts";
import NewPosts from "./components/NewPosts";
import Popularity from "./components/Popularity";
import Error from "./components/Error";
import {
	ApolloClient,
	HttpLink,
	InMemoryCache,
	ApolloProvider,
} from "@apollo/client";
const client = new ApolloClient({
	cache: new InMemoryCache(),
	link: new HttpLink({
		uri: "http://localhost:4000",
	}),
});
function App() {
	return (
		<ApolloProvider client={client}>
			<Router>
				<div className="App">
					<div className="App-body">
						<h1>Bintrest</h1>
						<nav className="navigationbar">
							<NavLink className="navigation" to="/">
								Images <br />
							</NavLink>
							<NavLink className="navigation" to="/my-bin">
								My Bin <br />
							</NavLink>
							<NavLink className="navigation" to="/my-posts">
								My Posts <br />
							</NavLink>
							<NavLink className="navigation" to="/new-posts">
								New Posts
								<br />
							</NavLink>
							<NavLink className="navigation" to="/popularity">
								Popular Posts
								<br />
							</NavLink>
						</nav>
						<div className="App">
							<div className="App-body">
								<Route exact path="/" component={Images} />
								<Route exact path="/my-bin" component={MyBin} />
								<Route exact path="/my-posts" component={MyPosts} />
								<Route exact path="/new-posts" component={NewPosts} />
								<Route exact path="/popularity" component={Popularity} />
								<Route exact path="*" component={Error} />
							</div>
						</div>
					</div>
				</div>
			</Router>
		</ApolloProvider>
	);
}

export default App;
