import React, { Fragment, useEffect, useState } from "react";

const ListPatients = () => {
	const [patients, setPatients] = useState([]);
	const [offset, setOffset] = useState(0);
	const [searchString, setSearchString] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isLoadingFast, setIsLoadingFast] = useState(false);
	const [gettingTopTen, setGettingTopTen] = useState(false);

	const getPatients = async () => {
		setIsLoadingFast(true)
		setGettingTopTen(false);
		try {
			const response = await fetch("http://localhost:5000/patients");
			const jsonData = await response.json();

			setPatients(jsonData);
		} catch (err) {
			console.error(err.message);
		}
		setIsLoadingFast(false);
	};

	const getNextPage = async () => {
		if (patients.length < 50) {
			return;
		}
		try {
			setIsLoadingFast(true);
			setOffset(offset + 50);
			let response;
			if (searchString === "") {
				response = await fetch(`http://localhost:5000/patients/${offset + 50}`);
			} else {
				response = await fetch(`http://localhost:5000/patients/${offset + 50}/${searchString}`);
			}
			setIsLoadingFast(false);
			const jsonData = await response.json();
			setPatients(jsonData);
		} catch (err) {
			console.error(err.message);
		}
	};

	const getLastPage = async () => {
		if (offset >= 50) {
			setIsLoadingFast(true);
			try {
				setOffset(offset - 50);
				let response;
				if (searchString === "") {
					response = await fetch(`http://localhost:5000/patients/${offset - 50}`);
				} else {
					response = await fetch(`http://localhost:5000/patients/${offset - 50}/${searchString}`);
				}
				const jsonData = await response.json();
				setIsLoadingFast(false);
				setPatients(jsonData);
			} catch (err) {
				console.error(err.message);
			}
		}
	};

	const findByIdCode = async () => {
		try {
			setOffset(0);
			setIsLoading(true);
			const response = await fetch(`http://localhost:5000/patients/0/${searchString}`);
			const jsonData = await response.json();
			setPatients(jsonData);
		} catch (err) {
			console.error(err.message);
		}
		setIsLoading(false);
	}

	const findTopTen = async (setValue) => {
		try {
			setIsLoading(true);
			setGettingTopTen(setValue);
			const response = await fetch(`http://localhost:5000/top`);
			const jsonData = await response.json();
			setPatients(jsonData);
			setIsLoading(false);
		} catch (err) {
			console.error(err.message);
		}
	}

	useEffect(() => {
		getPatients();
	}, []);

	function getGender(patient) {
		let gender = patient.id_code[0];
		let women = ["2", "4", "6", "8"];
		let men = ["1", "3", "5", "7"];
		if (men.includes(gender)) {
			patient.gender = "Male";
		}
		else if (women.includes(gender)) {
			patient.gender = "Female";
		} else {
			patient.gender = "Unknown";
		}
		return patient.gender;
	}

	function getBirthDate(patient) {
		const prefix = ["19", "20"];

		let year = patient.id_code.slice(1, 3);
		let month = patient.id_code.slice(3, 5);
		let day = patient.id_code.slice(5, 7);

		let nineteen = ["3", "4"];
		let twenty = ["5", "6",];
		let date = "";
		if (nineteen.includes(patient.id_code[0])) {
			date = prefix[0] + year + "-" + month + "-" + day;
		}
		if (twenty.includes(patient.id_code[0])) {
			date = prefix[1] + year + "-" + month + "-" + day;
		}
		patient.birth_date = date;
		return date;
	}

	function getAge(patient) {
		var ageDifMs = Date.parse(patient.visit_time) - Date.parse(patient.birth_date);
		var ageDate = new Date(ageDifMs); // miliseconds from epoch
		return Math.abs(ageDate.getUTCFullYear() - 1970);
	}

	function getCorrectTable() {
		if (isLoading) {
			return (
				<Fragment>
					<div className="d-flex justify-content-center text-primary mt-5">
						<div className="spinner-border" role="status">
							<span className="sr-only">Loading...</span>
						</div>
					</div>
				</Fragment>
			)

		}
		else if (gettingTopTen) {
			return (
				<Fragment>
					<button className="btn btn-primary center ml-5 mt-3" disabled={isLoading} onClick={() => getPatients()}>Go back to normal view</button>
					<table className="table mt-5 ml-3 patient-table">
						<thead>
							<tr>
								<th>Count</th>
								<th>IDCode</th>
							</tr>
						</thead>
						<tbody>
							{patients.map(patient => (
								<tr key={patient.id_code}>
									<td>
										{patient.counted}
									</td>
									<td>{patient.id_code}</td>
								</tr>
							))}
						</tbody>
					</table>
				</Fragment>
			)
		} else {
			return (
				<Fragment>
					<div className="input-group ml-5 mb-3">

						<input
							type="text"
							className="form-control col-3 mr-3"
							value={searchString}
							onChange={e => setSearchString(e.target.value)}
						/>
						<button disabled={isLoading} onClick={() => findByIdCode()}
							className="btn btn-success mr-5">Search by ID Code</button>

					</div>
					<div className='parent'>
						<button className="btn btn-primary ml-5 mr-3 center" disabled={isLoadingFast} onClick={() => getLastPage()}>Last page</button>
						<button className="btn btn-primary" disabled={isLoadingFast} onClick={() => getNextPage()}>Next page</button>
						<button className="btn btn-info center ml-5" disabled={isLoadingFast} onClick={() => findTopTen(true)}>Find top 10</button>
					</div>
					<div className="child ml-4 mt-3">Entries {offset} - {offset + 50}</div>
					<table className="table ml-3 patient-table">
						<thead>
							<tr>
								<th>Code</th>
								<th>Department</th>
								<th>VisitTime</th>
								<th>FirstName</th>
								<th>LastName</th>
								<th>Email</th>
								<th>IDCode</th>
								<th>Gender</th>
								<th>Birthdate</th>
								<th>Age during visit</th>
							</tr>
						</thead>
						<tbody>
							{patients.map(patient => (
								<tr key={patient.patient_id}>
									<td>
										{patient.code}
									</td>
									<td>{patient.dep}</td>
									<td>
										{patient.visit_time}
									</td>
									<td>
										{patient.first_name}
									</td>
									<td>
										{patient.last_name}
									</td>
									<td>
										{patient.email}
									</td>
									<td>
										{patient.id_code}
									</td>
									<td>
										{getGender(patient)}
									</td>
									<td>
										{getBirthDate(patient)}
									</td>
									<td>
										{getAge(patient)}
									</td>
									<td>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</Fragment>
			)
		}
	}

	return (
		<Fragment>
			{" "}
			{getCorrectTable()}
		</Fragment>
	);
};

export default ListPatients;