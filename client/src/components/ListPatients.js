import React, { Fragment, useEffect, useState } from "react";

const ListPatients = () => {
	const [patients, setPatients] = useState([]);

	//delete patient function
	const deletePatient = async id => {
		try {
			const deletePatient = await fetch(`http://localhost:5000/patients/${id}`, {
				method: "DELETE"
			});

			setPatients(patients.filter(patient => patient.patient_id !== id));
		} catch (err) {
			console.error(err.message);
		}
	};

	const getPatients = async () => {
		try {
			const response = await fetch("http://localhost:5000/patients");
			const jsonData = await response.json();

			setPatients(jsonData);
		} catch (err) {
			console.error(err.message);
		}
	};

	useEffect(() => {
		getPatients();
	}, []);

	console.log(patients);

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

		//1234 prefix 19
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

	return (
		<Fragment>
			{" "}
			<table className="table mt-5 ml-3 patient-table">
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

						<th>Delete</th>
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
								<button
									className="btn btn-danger"
									onClick={() => deletePatient(patient.patient_id)}
								>
									Delete
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</Fragment>
	);
};

export default ListPatients;