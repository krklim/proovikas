import React, { Fragment, useState } from "react";


const InputPatients = () => {
	const [isLoading, setIsLoading] = useState(false);
	let fileupload;

	const uploadFile = async e => {
		if (!fileupload) {
			return;
		}
		setIsLoading(true);
		e.preventDefault();
		var algus = Date.now()
		const formData = new FormData();
		formData.append("textFile", fileupload);

		fetch('http://localhost:5000/upload', {
			method: "post",
			body: formData
		}).then(res => {
			var vahe = (Date.now() - algus) / 1000
			setIsLoading(false);
			alert(`You have successfully uploaded the file in ${vahe} seconds}!`);
			window.location = "/";
		})
	}

	const handleChange = (e) => {
		const [file] = e.target.files;
		fileupload = file;
	};

	if (!isLoading) {
		return (
			<Fragment>
				<h1 className="text-center mt-5">Patients Data Proovitöö</h1>
				<div className="input-group mb-3">
					<input type="file" accept=".txt" className="form-control ml-5 mr-3 col-3" id="fileupload" onChange={handleChange}></input>
					<button id="upload-button" type="button" onClick={uploadFile} className="btn btn-primary">Click to upload</button>
				</div>
			</Fragment>
		);
	} else {
		return (
			<Fragment>
				<h1 className="text-center mt-5">Patients Data Proovitöö</h1>
				<div className="input-group mb-3">
					<input type="file" accept=".txt" className="form-control ml-5 mr-3 col-3" id="fileupload" onChange={handleChange}></input>
					<div className="d-flex justify-content-center text-primary">
						<div className="spinner-border" role="status">
							<span className="sr-only">Loading...</span>
						</div>
					</div>
				</div>
			</Fragment>
		)
	}
};

export default InputPatients;