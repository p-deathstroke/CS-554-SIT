import React from "react";
import queries from "./queries";
import { useQuery, useMutation } from "@apollo/client";
import { Card } from "react-bootstrap";
import { useState } from "react";

function Images() {
	const [pageNum, setMore] = useState(0);
	const { data, loading, error } = useQuery(queries.GET_UNSPLASH_IMAGES, {
		variables: {
			pageNum,
		},
		fetchPolicy: "cache-and-network",
	});
	const [addToBin] = useMutation(queries.ADD_TO_BIN);
	if (loading) return <p>loading...</p>;
	if (!data) return <p>Not found</p>;
	if (error) return <p> ERROR </p>;

	return (
		<div className="images">
			<div className="Images-body">
				{data &&
					data.unsplashImages.map((x) => (
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
										addToBin({
											variables: {
												id: x.id,
												url: x.url,
												posterName: x.posterName,
												description: x.description,
												binned: x.binned,
											},
										});
									}}
								>
									{x.binned ? <p>Remove from Bin</p> : <p>Add to Bin</p>}
								</button>
							</Card.Body>
							<br />
						</Card>
					))}
			</div>
			<button onClick={() => setMore(pageNum + 1)}>More Images</button>
		</div>
	);
}
export default Images;
