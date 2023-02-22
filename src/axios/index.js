const axios = require("axios");

const clienteAxios = axios.create({
  // baseURL: "http://localhost:9080/",
  baseURL: "http://35.153.255.14:9080/",
});

exports.clienteAxios = clienteAxios;
