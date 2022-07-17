-- Seeing as we will be testing out this script alot we can destroy the db before creating everything again
-- DROP DATABASE IF EXISTS patients;

-- Create the db
CREATE DATABASE patients;

-- Move into the db
\c patients

-- Create our table if it doesn't already exist (IF NOT EXISTS)
CREATE TABLE IF NOT EXISTS patients
(
    patient_id serial PRIMARY KEY,
    code VARCHAR(256),
    dep VARCHAR(128),
    visit_time VARCHAR(128),
    first_name VARCHAR(256),
    last_name VARCHAR(256),
    email VARCHAR(128),
    id_code VARCHAR(32)
);

-- Changes the owner of the table to postgres which is the default when installing postgres
ALTER TABLE patients
    OWNER to postgres;

-- Search for starting with id_code
SELECT * FROM patients WHERE id_code LIKE 'stringtosearchfor%'

-- get count of all rows in db
SELECT COUNT(*) as rows FROM patients;

-- Get top 10 most common id codes
SELECT id_code, COUNT(*) AS counted
FROM   patients
GROUP  BY id_code
ORDER  BY counted DESC
LIMIT  10;