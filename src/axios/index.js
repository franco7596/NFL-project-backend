const axios = require("axios");

const clienteAxios = axios.create({
	baseURL: "http://localhost:9080/",
});

exports.clienteAxios = clienteAxios;
