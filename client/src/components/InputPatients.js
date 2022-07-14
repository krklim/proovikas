import React, { Fragment, useState } from "react";

const InputPatients = () => {
	const [first_name] = useState("");
	let fileupload;

	const uploadFile = async e => {
		e.preventDefault();
		var textString = await fileupload.text();
		console.log(textString)
		let dataRows = textString.split(/[\r\n]+/g);
		console.log(dataRows.length);
		dataRows.shift();
		let jsonBody = [];
		let counter = 0;
		dataRows.forEach(async row => {
			var p = row.split(";");
			let patient = {
				code: p[0],
				dep: p[1],
				visit_time: p[2],
				first_name: p[3],
				last_name: p[4],
				email: p[5],
				id_code: p[6]
			}
			jsonBody.push(patient);
			counter += 1;
			if (counter === 500) {
				counter = 0;
				let stringifiedBody = JSON.stringify(jsonBody);
				jsonBody = [];
				await fetch('http://localhost:5000/patients', {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: stringifiedBody
				});
			}
			//network request using POST method of fetch

		});
		
		if(counter > 0){
			let stringifiedBody = JSON.stringify(jsonBody);
			await fetch('http://localhost:5000/patients', {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: stringifiedBody
				});
		}
		alert('You have successfully uploaded the file!');
		// window.location = "/";
	}
	
	const handleChange = (e) => {
		const [file] = e.target.files;
		console.log(file);
		fileupload = file;
	};

	return (
		<Fragment>
			<h1 className="text-center mt-5">Pern Patients List</h1>
			<div className="input-group mb-3">
				<input type="file" className="form-control" id="fileupload" onChange={handleChange}></input>
				<button id="upload-button" type="button" onClick={uploadFile} className="btn btn-primary">Click to upload</button>
			</div>
			

			{/* <form className="d-flex mt-5" onSubmit={onSubmitForm}>
				<input
					type="text"
					className="form-control"
					value={first_name}
					onChange={e => setDescription(e.target.value)}
				/>
				<button className="btn btn-success">Add</button>
			</form> */}
		</Fragment>
	);
};

export default InputPatients;