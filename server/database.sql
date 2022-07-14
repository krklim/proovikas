-- Seeing as we will be testing out this script alot we can destroy the db before creating everything again
-- DROP DATABASE IF EXISTS patients;

-- Create the db
CREATE DATABASE patients;

-- Move into the db
\c patients

-- Create our table if it doesn't already exist (IF NOT EXISTS)
CREATE TABLE patients
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