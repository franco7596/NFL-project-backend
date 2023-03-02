const jwt = require("jsonwebtoken");

function validarJWT(req, res, next) {
	const token = req.header("x-acces-token");
	if (!token) {
		return res.status(498).json({
			ok: false,
			msj: "No token in the request",
		});
	}
	try {
		jwt.verify(token, "MY_SECRET", (error) => {
			if (error) {
				return res.status(498).json({
					ok: false,
					msg: "Invalid or expired token",
				});
			} else {
				next();
			}
		});
	} catch (error) {
		return res.status(498).json({
			ok: false,
			msg: "Invalid or expired token",
		});
	}
}

exports.validarJWT = validarJWT;
