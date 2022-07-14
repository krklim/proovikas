const express = require("express")
const path = require('path');
const app = express();
const port = '5000';
const pool = require("./db")
const cors = require("cors");

console.log(path);

//middleware//
app.use(cors());
//returns server response in json form (gives access to the json.body)
app.use(express.json());

app.listen(port, () => {
	console.log(`Server is listening on port ${port}...`);
  });

app.get("/hello", (req, res) => {
	res.send("Hello world!");
});

//REST API ROUTES//
//get all
app.get("/patients", async (req, res) => {
	try {
		const allPatients = await pool.query("SELECT * FROM patients LIMIT 100");

		res.json(allPatients.rows);
	} catch (err) {
		console.error(err.message);
	}
})

//get one by id (can get later by id_code)
try {
	app.get("/patients/:id", async (req, res) => {
		const { id } = req.params;
		console.log(req.params);
		const patient = await pool.query("SELECT * FROM patients WHERE id = $1",
			[
				id
			]);

		res.json(patient.rows[0]);
	})
} catch (err) {
	console.error(err.message);
}


//post
// app.post("/patients", async (req, res) => {
// 	try {
// 		const { code, dep, visit_time, first_name, last_name, email, id_code } = req.body;
// 		console.log(req.body)
// 		const newPatient = await pool.query("INSERT INTO patients (code, dep, visit_time, first_name, last_name, email, id_code) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
// 			[code, dep, visit_time, first_name, last_name, email, id_code])

// 		res.json(newPatient.rows);
// 	} catch (err) {
// 		console.error(err.message);
// 	}
// })

//post multiple
app.post("/patients", async (req, res) => {
	try {
		const jsonBody = req.body;
		console.log(req.body)
		let queryString = "INSERT INTO patients (code, dep, visit_time, first_name, last_name, email, id_code) VALUES ";
		jsonBody.forEach(patient => {
			queryString += `(\'${patient.code}\', \'${patient.dep}\', \'${patient.visit_time}\', \'${patient.first_name}\', \'${patient.last_name}\', \'${patient.email}\', \'${patient.id_code}\'), `
		});
		queryString = queryString.slice(0, -2) + ";";
		console.log(queryString);
		const newPatient = await pool.query(queryString);
		res.json(newPatient.rows);
	} catch (err) {
		console.error(err.message);
	}
})

//update POOLELI 
app.put("/patients/:id", async (req, res) => {
	try {
		const { id } = req.params; // used for the where
		const { code, dep, visit_time, first_name, last_name, email, id_code } = req.body; // set new

		const updatePatient = await pool.query("UPDATE patients SET code = $1 WHERE patients id = $2",
			[code, dep])
		res.json("Patient data was updated!")
	} catch (err) {
		console.error(err.message);
	}
})

//delete
app.delete("/patients/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const deletePatient = await pool.query("DELETE FROM patients WHERE patient_id = $1", [id])
		res.json("Patient was successfully deleted!")
	} catch (err) {
		console.error(err.message);
	}
})


