const { pool } = require("../database/pgConection");
const { clienteAxios } = require("../axios");

async function upDateDataBasePlayer(req, res) {
	try {
		await clearDatabasePlayers();
		const rostersData = await getData("roster_NFL");

		let positions = [];
		let positionsId = [];
		let status = [];
		let statusId = [];
		let college = [];
		let collegeId = [];
		let hometown = [];
		let hometownId = [];
		rostersData.forEach((player) => {
			if (!positions.includes(player.position)) positions.push(player.position);
			if (!status.includes(player.status)) status.push(player.status);
			if (!college.includes(player.college)) college.push(player.college);
			if (!hometown.includes(player.hometown)) hometown.push(player.hometown);
		});
		positionsId = await getId("position", positions);
		statusId = await getId("status", status);
		collegeId = await getId("college", college);
		hometownId = await getId("hometown", hometown);
		const queryInsertRoster = `INSERT INTO player (name, image, status_id, number, position_id, height, age, experience, weight, arms, hands, college_id, hometown_id ) VALUES ( $1 , $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13 ) RETURNING id`;

		rostersData.forEach((player) => {
			let positionsIdPlayer = positionsId[positions.indexOf(player.position)];
			let statusIdPlayer = statusId[status.indexOf(player.status)];
			let collegeIdPlayer = collegeId[college.indexOf(player.college)];
			let hometownIdPlayer = hometownId[hometown.indexOf(player.hometown)];
			let numberPlayer = player.number !== "" ? parseInt(player.number) : 0;
			let agePlayer = player.age !== "" ? parseInt(player.age) : 0;
			let experiencePlayer =
				player.experience !== "" ? parseInt(player.experience) : 0;

			pool
				.query(queryInsertRoster, [
					player.name,
					player.image,
					statusIdPlayer,
					numberPlayer,
					positionsIdPlayer,
					player.height,
					agePlayer,
					experiencePlayer,
					player.weight,
					player.arms,
					player.hands,
					collegeIdPlayer,
					hometownIdPlayer,
				])
				.then((idPlayer) => {
					pool
						.query(
							`INSERT INTO player_x_team (team_id, player_id, timestamp ) VALUES ((SELECT id FROM team WHERE name = $1 LIMIT 1), $2, $3)`,
							[player.nameTeam, idPlayer.rows[0].id, player.timestamp]
						)
						.catch((err) => {
							return res.status(500).json({
								status: 500,
								error: err,
							});
						});
				})
				.catch((err) => {
					return res.status(500).json({
						status: 500,
						error: err,
					});
				});
		});

		return res.status(200).json({
			status: 200,
			statusText: "ok",
		});
	} catch (e) {
		return res.status(500).json({
			status: 500,
			error: e,
		});
	}
}
async function getId(tableName, arrayData) {
	return await Promise.all(
		arrayData.map(async (name) => {
			let response = await pool.query(getQueryInsert(tableName), [name]);
			return response.rows[0].id;
		})
	);
}

async function upDateDataBaseTeam(req, res) {
	try {
		await clearDatabase();
		const teamsData = await getData("teams_NFL");
		const queryInsertTeam = `INSERT INTO team (name, image, "backgroundImage_1", "backgroundImage_2", official_page, stadium_id, established) VALUES ( $1 , $2, $3, $4, $5, $6, $7 ) RETURNING id`;
		teamsData.forEach((team) => {
			pool
				.query(getQueryInsert("stadium"), [team.stadium.replace(/[^\w ]/g, "")])
				.then((idStadium) => {
					pool
						.query(queryInsertTeam, [
							team.name,
							team.image,
							team.backgroundImage,
							team.backgroundImage2,
							team.officialPage,
							idStadium.rows[0].id,
							team.established,
						])
						.then((idTeam) => {
							pool
								.query(getQueryInsert("division"), [team.division])
								.then((idDivision) => {
									pool.query(
										"INSERT INTO team_x_division (id_division, id_team, timestamp ) VALUES ($1, $2, $3)",
										[idDivision.rows[0].id, idTeam.rows[0].id, team.timestamp]
									);
								});
							pool.query(
								"INSERT INTO games (won, lost, tied, team_id, timestamp) VALUES ($1, $2, $3, $4, $5) RETURNING id",
								[
									team.won,
									team.lost,
									team.tied,
									idTeam.rows[0].id,
									team.timestamp,
								]
							);
							pool
								.query(getQueryInsert("head_coach"), [team.headCoach])
								.then((idHeadCoach) => {
									pool.query(
										"INSERT INTO team_x_head_coach (id_head_coach, id_team, timestamp ) VALUES ($1, $2, $3)",
										[idHeadCoach.rows[0].id, idTeam.rows[0].id, team.timestamp]
									);
								});
							team.owner.forEach((owner) => {
								pool.query(getQueryInsert("owner"), [owner]).then((idOwner) => {
									pool.query(
										"INSERT INTO team_x_owner (id_owner, id_team, timestamp ) VALUES ($1, $2, $3)",
										[idOwner.rows[0].id, idTeam.rows[0].id, team.timestamp]
									);
								});
							});
						});
				});
		});
		return res.status(200).json({
			status: 200,
			statusText: "ok",
		});
	} catch (e) {
		return res.status(500).json({
			status: 500,
			error: e,
		});
	}
}
function getQueryInsert(tableName) {
	return `INSERT INTO ${tableName} (name) VALUES ($1) RETURNING id`;
}

async function clearDatabase() {
	await pool.query("DELETE FROM player_x_team");
	await pool.query("DELETE FROM team_x_division");
	await pool.query("DELETE FROM team_x_head_coach");
	await pool.query("DELETE FROM team_x_owner");
	await pool.query("DELETE FROM games");
	await pool.query("DELETE FROM team");
	await pool.query("DELETE FROM stadium");
	await pool.query("DELETE FROM division");
	await pool.query("DELETE FROM head_coach");
}
async function clearDatabasePlayers() {
	await pool.query("DELETE FROM player_x_team");
	await pool.query("DELETE FROM player");
	await pool.query("DELETE FROM position");
	await pool.query("DELETE FROM college");
	await pool.query("DELETE FROM status");
	await pool.query("DELETE FROM position");
	await pool.query("DELETE FROM position");
	await pool.query("DELETE FROM status");
}
async function getData(spider) {
	const answer = await clienteAxios.get(
		`crawl.json?spider_name=${spider}&url=https://www.nfl.com/teams/`
	);
	return answer.data.items;
}

exports.upDateDataBaseTeam = upDateDataBaseTeam;
exports.upDateDataBasePlayer = upDateDataBasePlayer;
