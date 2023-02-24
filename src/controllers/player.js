const { pool } = require("../database/pgConection");

async function getPlayersData(req, res) {
	const { page = 1 } = req.query;
	const numPage = parseInt(page) - 1;
	const queyToDatabase =
		queryGetPlayer +
		`
			order by id offset ${numPage * 50} rows fetch next 50 rows only;
	`;
	const queryCantPlayers = `
		SELECT COUNT(id) FROM player
	`;
	pool
		.query(queryCantPlayers)
		.then((cantPlayers) => {
			pool
				.query(queyToDatabase)
				.then((resp) => {
					let players = resp.rows.map((rowPlayer) => {
						return {
							id: rowPlayer.id,
							infoPlayer: {
								name: rowPlayer.name_player,
								height: rowPlayer.height,
								age: rowPlayer.age,
								experience: rowPlayer.experience,
								weight: rowPlayer.weight,
								arms: rowPlayer.arms,
								hands: rowPlayer.hands,
							},
							images: {
								photo: rowPlayer.image,
							},
							infoCurrentTeam: {
								id: rowPlayer.id_team,
								name: rowPlayer.name_team,
								position: rowPlayer.name_position,
								number: rowPlayer.number,
								status: rowPlayer.name_status,
							},
							hometown: {
								name: rowPlayer.name_hometown,
							},
							college: {
								name: rowPlayer.name_college,
							},
						};
					});
					return res.status(200).json({
						status: 200,
						statusText: "ok",
						numPages: Math.floor(parseInt(cantPlayers.rows[0].count) / 50) + 1,
						currentPage: numPage + 1,
						players: players,
					});
				})
				.catch((err) => {
					return res.status(500).json({
						status: 500,
						statusText: "fail",
						error: err,
					});
				});
		})
		.catch((err) => {
			return res.status(500).json({
				status: 500,
				statusText: "fail",
				error: err,
			});
		});
}
async function getPlayersByTeam(req, res) {
	const { id_team } = req.query;
	const queyToDatabase =
		queryGetPlayer +
		`
			AND T.id = $1;
	`;
	pool
		.query(queyToDatabase, [id_team])
		.then((resp) => {
			let players = resp.rows.map((rowPlayer) => {
				return {
					id: rowPlayer.id,
					infoPlayer: {
						name: rowPlayer.name_player,
						height: rowPlayer.height,
						age: rowPlayer.age,
						experience: rowPlayer.experience,
						weight: rowPlayer.weight,
						arms: rowPlayer.arms,
						hands: rowPlayer.hands,
					},
					images: {
						photo: rowPlayer.image,
					},
					infoCurrentTeam: {
						id: rowPlayer.id_team,
						name: rowPlayer.name_team,
						position: rowPlayer.name_position,
						number: rowPlayer.number,
						status: rowPlayer.name_status,
					},
					hometown: {
						name: rowPlayer.name_hometown,
					},
					college: {
						name: rowPlayer.name_college,
					},
				};
			});
			return res.status(200).json({
				status: 200,
				statusText: "ok",
				players: players,
			});
		})
		.catch((err) => {
			return res.status(500).json({
				status: 500,
				statusText: "fail",
				error: err,
			});
		});
}

function getComboStatus(req, res) {
	pool
		.query(
			`
			SELECT *
			FROM status
			ORDER BY name
			`
		)
		.then((status) => {
			return res.status(200).json({
				status: 200,
				statusText: "ok",
				statusPlayer: status.rows,
			});
		})
		.catch((err) => {
			return res.status(500).json({
				status: 500,
				statusText: "fail",
				error: err,
			});
		});
}

exports.getPlayersData = getPlayersData;
exports.getPlayersByTeam = getPlayersByTeam;
exports.getComboStatus = getComboStatus;

const queryGetPlayer = `
			SELECT
			P.id,
			P.name as name_player,
			P.image,
			S.name as name_status,
			P.number,
			POS.name AS name_position,
			P.height,
			P.age,
			P.experience,
			P.weight,
			P.arms,
			P.hands,
			H.name AS name_hometown,
			C.name AS name_college,
			(SELECT COUNT(id) FROM player) AS cant_players,
			T.id AS id_team,
			T.name AS name_team
			FROM player AS P
			INNER JOIN status AS S
			ON P.status_id = S.id
			INNER JOIN position AS POS
			ON P.position_id = POS.id
			INNER JOIN college AS C
			ON P.college_id = C.id
			INNER JOIN player_x_team AS PXT
			ON P.id = PXT.player_id
			INNER JOIN team AS T
			ON T.id = PXT.team_id
			INNER JOIN hometown AS H
			ON P.hometown_id = H.id
			WHERE
			PXT.timestamp =
			(SELECT MAX(player_x_team.timestamp) FROM player_x_team WHERE player_x_team.player_id = P.id )
`;
