const { Router } = require("express");
const { getTeamsData } = require("../controllers/team");
const router = Router();

router.get("/getTeam", getTeamsData);

exports.Router = router;
