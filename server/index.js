const express = require("express");
const app = express();
const port = '5000';
const pool = require("./db")
const cors = require("cors");
const fileUpload = require("express-fileupload");
const readline = require("readline");
const { Duplex } = require('stream');

const text = `CREATE TABLE IF NOT EXISTS "patients"
(
    patient_id serial PRIMARY KEY,
    code VARCHAR(256),
    dep VARCHAR(128),
    visit_time VARCHAR(128),
    first_name VARCHAR(256),
    last_name VARCHAR(256),
    email VARCHAR(128),
    id_code VARCHAR(32)
);`;

pool.query(text).then(result => {
	if (result) {
		console.log('Database initialized');
	}
})

//middleware//
app.use(cors());
//returns server response in json form (gives access to the json.body)
app.use(express.json());

app.listen(port, () => {
	console.log(`Server is listening on port ${port}...`);
});

function bufferToStream(myBuffer) {
	let tmp = new Duplex();
	tmp.push(myBuffer);
	tmp.push(null);
	return tmp;
}

function* splitBuffer(buffer, delim) {
	// to skip first line of text file
	let start = 50;
	while (true) {
		let nxt = buffer.indexOf(delim, start);
		let chunk;
		if (nxt == -1) {
			chunk = buffer.slice(start);
			yield chunk;
			break;
		} else {
			chunk = buffer.slice(start, nxt);
			yield chunk;
		}
		start = nxt + 1;
	}
}

app.use(fileUpload())
app.post("/upload", async (req, res) => {
	if (!req.files) {
		res.status(400);
		res.end();
	}
	let file = req.files.textFile;

	let chunks = splitBuffer(file.data, "0x0A") // 0x0A stands for newline
	for (const chunk of chunks) {
		const fileStream = bufferToStream(chunk);

		const rl = readline.createInterface({
			input: fileStream,
			crlfDelay: Infinity
		});
		// use the crlfDelay option to recognize all instances of CR LF
		// ('\r\n') in text as a single line break.

		let startString = "INSERT INTO patients (code, dep, visit_time, first_name, last_name, email, id_code) VALUES ";
		let counter = 0;

		for await (const line of rl) {
			// Each line in input.txt will be successively available here as `line`.
			let p = line.split(";");
			// if invalid data then continue
			if (p.length !== 7) continue;
			if (counter === 0) {
				queryString = startString;
			}
			queryString += `(\'${p[0]}\', \'${p[1]}\', \'${p[2]}\', \'${p[3]}\', \'${p[4]}\', \'${p[5]}\', \'${p[6]}\'), `
			counter += 1;
			if (counter === 500) {
				counter = 0;
				queryString = queryString.slice(0, -2) + ";";
				try {
					await pool.query(queryString);
				} catch (err) {
					console.error(err.message);
				}
			}
		};
		//if there are less than 50 rows of querystring still not inserted
		if (counter > 0) {
			try {
				queryString = queryString.slice(0, -2) + ";";
				await pool.query(queryString);
			} catch (err) {
				console.error(err.message);
			}
		}
	};
	res.json("Patients from file were successfully inserted into the database!");
})

app.get("/top", async (req, res) => {
	try {
		const allPatients = await pool.query("SELECT id_code, COUNT(*) AS counted FROM patients GROUP BY id_code ORDER BY counted DESC LIMIT 10;");
		res.json(allPatients.rows);
	} catch (error) {
		console.err(err.message);
	}
})

//REST API ROUTES//
//get all
app.get("/patients", async (req, res) => {
	try {
		const allPatients = await pool.query("SELECT * FROM patients ORDER BY patient_id ASC LIMIT 50");

		res.json(allPatients.rows);
	} catch (err) {
		console.error(err.message);
	}
})

//get exact page
app.get("/patients/:offset", async (req, res) => {
	try {
		const { offset } = req.params;
		const allPatients = await pool.query("SELECT * FROM patients ORDER BY patient_id ASC LIMIT 50 OFFSET $1",
			[offset]);

		res.json(allPatients.rows);
	} catch (err) {
		console.error(err.message);
	}
})

//get one by id
try {
	app.get("/patients/:id", async (req, res) => {
		const { id } = req.params;
		const patient = await pool.query("SELECT * FROM patients WHERE id = $1",
			[
				id
			]);

		res.json(patient.rows[0]);
	})
} catch (err) {
	console.error(err.message);
}

//search by id_code
try {
	app.get("/patients/:searchString", async (req, res) => {
		const { offset, searchString } = req.params;
		const allPatients = await pool.query(`SELECT * FROM patients WHERE id_code LIKE '${searchString}%' ORDER BY patient_id ASC OFFSET ${offset} LIMIT 50`);

		res.json(allPatients.rows);
	})
} catch (err) {
	console.error(err.message);
}

//post multiple
app.post("/patients", async (req, res) => {
	try {
		const jsonBody = req.body;
		let queryString = "INSERT INTO patients (code, dep, visit_time, first_name, last_name, email, id_code) VALUES ";
		jsonBody.forEach(patient => {
			queryString += `(\'${patient.code}\', \'${patient.dep}\', \'${patient.visit_time}\', \'${patient.first_name}\', \'${patient.last_name}\', \'${patient.email}\', \'${patient.id_code}\'), `
		});
		queryString = queryString.slice(0, -2) + ";";
		const newPatient = await pool.query(queryString);
		res.json(newPatient.rows);
	} catch (err) {
		console.error(err.message);
	}
})

//update
app.put("/patients/:id", async (req, res) => {
	try {
		const { id } = req.params; // used for the where
		const { code, dep, visit_time, first_name, last_name, email, id_code } = req.body; // set new

		const updatePatient = await pool.query("UPDATE patients SET code = $1, dep = $2, visit_time = $3, first_name = $4, last_name = $5, email = $6, id_code = $7 WHERE patients id = $8",
			[code, dep, visit_time, first_name, last_name, email, id_code, id])
		res.json("Patient data was updated!");
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


