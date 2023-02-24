const { Router } = require("express");
const {
	getPlayersData,
	getPlayersByTeam,
	getComboStatus,
} = require("../controllers/player");
const router = Router();

router.get("/getPlayers", getPlayersData);
router.get("/getPlayersByTeam", getPlayersByTeam);
router.get("/getComboStatus", getComboStatus);

exports.Router = router;
