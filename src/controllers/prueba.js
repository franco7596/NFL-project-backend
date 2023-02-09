const { pool } = require("../database/pgConection");

async function prueba(req, res) {
	pool
		.query("SELECT * FROM team")
		.then((resp) => {
			return res.status(200).json({
				divisiones: resp.rows,
			});
		})
		.catch((e) => {
			return res.status(400).json({
				msg: "Error",
				e,
			});
		});
}

exports.prueba = prueba;
