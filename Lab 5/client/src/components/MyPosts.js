import React from "react";
import queries from "./queries";
import { useQuery, useMutation } from "@apollo/client";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";

function MyPosts() {
	const { data, loading, error } = useQuery(queries.GET_USER_POSTED_IMAGES, {
		fetchPolicy: "cache-and-network",
	});
	const [deleteImage] = useMutation(queries.DELETE_IMAGE);
	const [addToBin] = useMutation(queries.ADD_TO_BIN);
	if (loading) return <p>loading...</p>;
	if (!data.userPostedImages || data.userPostedImages === undefined)
		return <p>User has not posted an images</p>;
	if (error) return <p> ERROR </p>;
	return (
		<div className="images">
			<div className="Images-body">
				<br />
				<button variant="primary" onClick={() => {}}>
					<Link key="add-btn" to="/new-posts">
						Add Post
					</Link>
				</button>
				{data &&
					data.userPostedImages.map((x) => (
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
								<button
									variant="primary"
									onClick={(e) => {
										e.preventDefault();
										alert("Deleted");
										window.location.reload();
										deleteImage({ variables: { id: x.id } });
									}}
								>
									<p> Delete</p>
								</button>
							</Card.Body>
							<br />
						</Card>
					))}
			</div>
		</div>
	);
}
export default MyPosts;
