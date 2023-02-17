const { Router } = require("express");
const { getTeamsData, getTeamsById } = require("../controllers/team");
const router = Router();

router.get("/getTeam", getTeamsData);
router.get("/getTeamById", getTeamsById);

exports.Router = router;
