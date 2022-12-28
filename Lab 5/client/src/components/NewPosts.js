import React from "react";
import queries from "./queries";
import { useMutation } from "@apollo/client";

function NewPosts() {
	let url, description, posterName;
	const [uploadImage] = useMutation(queries.UPLOAD_IMAGE);
	return (
		<div className="uploads">
			<div className="uploads-body"></div> <br />
			<form
				onSubmit={(e) => {
					e.preventDefault();
					alert("Uploaded");
					uploadImage({
						variables: {
							url: url.value,
							description: description.value,
							posterName: posterName.value,
						},
					});
					window.location.reload();
				}}
			>
				<div className="form-group row">
					<label className="col-sm-2 col-form-label">URL</label>
					<div className="col-sm-10">
						<input
							className="form-control"
							id="url"
							placeholder=" Image URL"
							ref={(node) => {
								url = node;
							}}
						/>
					</div>
				</div>
				<div className="form-group row">
					<label className="col-sm-2 col-form-label">Description</label>
					<div className="col-sm-10">
						<input
							className="form-control"
							id="desc"
							placeholder="description"
							ref={(node) => {
								description = node;
							}}
						/>
					</div>
				</div>
				<div className="form-group row">
					<label className="col-sm-2 col-form-label">Poster Name</label>
					<div className="col-sm-10">
						<input
							className="form-control"
							id="postername"
							placeholder="posterName"
							ref={(node) => {
								posterName = node;
							}}
						/>
					</div>
				</div>
				<div className="form-group row">
					<div className="col-sm-10">
						<button type="submit" className="btn btn-primary">
							Post
						</button>
					</div>
				</div>
			</form>
		</div>
	);
}
export default NewPosts;
