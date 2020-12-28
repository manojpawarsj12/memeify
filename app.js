const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
require('dotenv').config()
const { Client } = require('pg');
const PORT = process.env.PORT || 3000;

const app = express();
app.use(morgan("dev"));
app.use(cors());
app.use(helmet());

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'memedb',
    password: 'xlmrsj0056',
    port: 5432,
});
const query = `
CREATE TABLE users (
    email varchar,
    firstName varchar,
    lastName varchar,
    age int
);
`;
client.connect();
client.query(query, (err, res) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log('Table is successfully created');
    client.end();
});