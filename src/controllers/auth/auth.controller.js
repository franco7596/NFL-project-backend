const jwt = require("jsonwebtoken");
const { pool } = require("../../database/pgConection");

const loginController = async (req, res) => {
	let { username, password } = req.body;
	try {
		let requestUser = await existThisUser(username, password);
		if (!requestUser?.rows[0]) {
			return res.status(401).json({
				status: 401,
				statusText: "fail",
				msg: "wrong user or password",
				login: false,
			});
		}
		const token = jwt.sign(
			{
				id: username,
			},
			"MY_SECRET",
			{
				expiresIn: "24h",
			}
		);
		return res.status(200).json({
			status: 200,
			statusText: "ok",
			token: token,
			login: true,
		});
	} catch {
		(err) => {
			return res.status(500).json({
				status: 500,
				statusText: "fail",
				msg: "unknown error",
				login: false,
				err,
			});
		};
	}
};

const existThisUser = (username, password) => {
	return pool.query(
		`
			SELECT *
			FROM public."user" 
			WHERE 
			name = $1
			AND
			password = $2
			`,
		[username, password]
	);
};

exports.loginController = loginController;
