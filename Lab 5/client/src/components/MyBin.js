import React from "react";
import queries from "./queries";
import { useQuery } from "@apollo/client";
import { Card } from "react-bootstrap";

function MyBin() {
	const { data, loading, error } = useQuery(queries.GET_BINNED_IMAGES, {
		fetchPolicy: "cache-and-network",
	});
	console.log(data);
	if (loading) return <p>loading...</p>;
	if (!data.binnedImages || data.binnedImages === undefined)
		return <p>No Images in Bin</p>;
	if (error) return <p> ERROR </p>;
	return (
		<div className="images">
			<div className="Images-body">
				{data &&
					data.binnedImages.map((x) => (
						<Card style={{ width: "10rem" }}>
							<Card.Title>{x.posterName}</Card.Title>
							<img
								style={{ width: "20rem" }}
								key={x.id}
								src={x.url}
								alt={x.id}
							/>
							<Card.Body>
								<Card.Text>{x.description}</Card.Text>
								<button
									variant="primary"
									onClick={() => {
										//addToBin({ variables: { id: x.id, url: x.url } });
									}}
								>
									<p> Remove from Bin </p>
									{/* {x.binned ? <p>Remove from Bin</p> : <p>Add to Bin</p>} */}
								</button>
							</Card.Body>
							<br />
						</Card>
					))}
			</div>
		</div>
	);
}

export default MyBin;
