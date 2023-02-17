const { pool } = require("../database/pgConection");

async function getTeamsData(req, res) {
	pool
		.query(
			`
			SELECT
			T.id,
			T.name as name_team,
			T.image,
			T."backgroundImage_1",
			T."backgroundImage_2",
			T.official_page,
			T.established,
			S.name AS name_stadium,
			D.name AS name_division,
			G.won,
			G.lost,
			G.tied,
			H.name AS name_head_coach,
			O.name AS name_owner
			FROM team AS T
			INNER JOIN stadium AS S
			ON T.stadium_id = S.id
			INNER JOIN team_x_division AS TXD
			ON T.id = TXD.id_team
			INNER JOIN division AS D
			ON TXD.id_division = D.id
			INNER JOIN games AS G
			ON T.id = G.team_id
			INNER JOIN team_x_head_coach AS TXH
			ON T.id = TXH.id_team
			INNER JOIN head_coach AS H
			ON TXH.id_head_coach = H.id
			INNER JOIN team_x_owner AS TXO
			ON T.id = TXO.id_team
			INNER JOIN owner AS O
			ON TXO.id_owner = O.id
			WHERE
			G.timestamp =
			(SELECT MAX(games.timestamp) FROM games WHERE games.team_id = T.id )
			AND
			TXD.timestamp =
			(SELECT MAX(team_x_division.timestamp) FROM team_x_division WHERE team_x_division.id_team = T.id )
			AND
			TXH.timestamp =
			(SELECT MAX(team_x_head_coach.timestamp) FROM team_x_head_coach WHERE team_x_head_coach.id_team = T.id )
			AND
			TXO.timestamp =
			(SELECT MAX(team_x_owner.timestamp) FROM team_x_owner WHERE team_x_owner.id_team = T.id )
			ORDER BY T.id;
		`
		)
		.then((resp) => {
			let teams = [];
			let team = {};
			resp.rows.forEach((rowTeam) => {
				if (team.id === rowTeam.id) {
					team.owners.push({ name: rowTeam.name_owner });
				} else {
					if (team.id) {
						teams.push(team);
					}
					team = {
						id: rowTeam.id,
						infoTeam: {
							name: rowTeam.name_team,
							established: rowTeam.established,
							stadium: rowTeam.name_stadium,
							officialPage: rowTeam.official_page,
						},
						images: {
							logo: rowTeam.image,
							background_1: rowTeam.backgroundImage_1,
							background_2: rowTeam.backgroundImage_2,
						},
						headCoach: {
							name: rowTeam.name_head_coach,
						},
						games: {
							won: rowTeam.won,
							lost: rowTeam.lost,
							tied: rowTeam.tied,
						},
						owners: [{ name: rowTeam.name_owner }],
						division: { name: rowTeam.name_division },
					};
				}
			});
			return res.status(200).json({
				status: 200,
				statusText: "ok",
				teams: teams,
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

async function getTeamsById(req, res) {
	const { id } = req.query;
	const lastPartRequest = `
	AND
	T.id = $1
	ORDER BY T.id;
	`;
	pool
		.query(queryTeam + lastPartRequest, [id])
		.then((resp) => {
			let team = {};
			resp.rows.forEach((rowTeam) => {
				if (team.id === rowTeam.id) {
					team.owners.push({ name: rowTeam.name_owner });
				} else {
					team = {
						id: rowTeam.id,
						infoTeam: {
							name: rowTeam.name_team,
							established: rowTeam.established,
							stadium: rowTeam.name_stadium,
							officialPage: rowTeam.official_page,
						},
						images: {
							logo: rowTeam.image,
							background_1: rowTeam.backgroundImage_1,
							background_2: rowTeam.backgroundImage_2,
						},
						headCoach: {
							name: rowTeam.name_head_coach,
						},
						games: {
							won: rowTeam.won,
							lost: rowTeam.lost,
							tied: rowTeam.tied,
						},
						owners: [{ name: rowTeam.name_owner }],
						division: { name: rowTeam.name_division },
					};
				}
			});
			return res.status(200).json({
				status: 200,
				statusText: "ok",
				team: team,
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

exports.getTeamsData = getTeamsData;
exports.getTeamsById = getTeamsById;

const queryTeam = `			
			SELECT
			T.id,
			T.name as name_team,
			T.image,
			T."backgroundImage_1",
			T."backgroundImage_2",
			T.official_page,
			T.established,
			S.name AS name_stadium,
			D.name AS name_division,
			G.won,
			G.lost,
			G.tied,
			H.name AS name_head_coach,
			O.name AS name_owner
			FROM team AS T
			INNER JOIN stadium AS S
			ON T.stadium_id = S.id
			INNER JOIN team_x_division AS TXD
			ON T.id = TXD.id_team
			INNER JOIN division AS D
			ON TXD.id_division = D.id
			INNER JOIN games AS G
			ON T.id = G.team_id
			INNER JOIN team_x_head_coach AS TXH
			ON T.id = TXH.id_team
			INNER JOIN head_coach AS H
			ON TXH.id_head_coach = H.id
			INNER JOIN team_x_owner AS TXO
			ON T.id = TXO.id_team
			INNER JOIN owner AS O
			ON TXO.id_owner = O.id
			WHERE
			G.timestamp =
			(SELECT MAX(games.timestamp) FROM games WHERE games.team_id = T.id )
			AND
			TXD.timestamp =
			(SELECT MAX(team_x_division.timestamp) FROM team_x_division WHERE team_x_division.id_team = T.id )
			AND
			TXH.timestamp =
			(SELECT MAX(team_x_head_coach.timestamp) FROM team_x_head_coach WHERE team_x_head_coach.id_team = T.id )
			AND
			TXO.timestamp =
			(SELECT MAX(team_x_owner.timestamp) FROM team_x_owner WHERE team_x_owner.id_team = T.id )
			`;
