const cors = require("cors");
const express = require("express");
const config = require("./config");
const bodyParser = require("body-parser");
const dataBaseRoutes = require("./routes/dataBase.routers");
const teamRoutes = require("./routes/teams.routers");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set("port", config.seting.port);
app.use(cors());
app.use(dataBaseRoutes.Router);
app.use(teamRoutes.Router);

exports.app = app;
