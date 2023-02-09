const { pool } = require("../database/pgConection");
const { clienteAxios } = require("../axios");

async function upDateDataBaseTeam(req, res) {
	try {
		await clearDatabase();
		const teamsData = await getDataTeam();
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
	await pool.query("DELETE FROM team_x_division");
	await pool.query("DELETE FROM team_x_head_coach");
	await pool.query("DELETE FROM team_x_owner");
	await pool.query("DELETE FROM games");
	await pool.query("DELETE FROM team");
	await pool.query("DELETE FROM stadium");
	await pool.query("DELETE FROM division");
	await pool.query("DELETE FROM head_coach");
}
async function getDataTeam() {
	const answer = await clienteAxios.get(
		"crawl.json?spider_name=teams_NFL&url=https://www.nfl.com/teams/"
	);
	return answer.data.items;
}

exports.upDateDataBaseTeam = upDateDataBaseTeam;
