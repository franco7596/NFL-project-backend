const { Router } = require("express");
const {
	getTeamsData,
	getTeamsById,
	getComboDivision,
} = require("../controllers/team");
const router = Router();

router.post("/getTeam", getTeamsData);
router.get("/getTeamById", getTeamsById);
router.get("/getComboDivision", getComboDivision);

exports.Router = router;
