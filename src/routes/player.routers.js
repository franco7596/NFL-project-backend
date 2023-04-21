const { Router } = require("express");
const {
	getPlayersData,
	getPlayersByTeam,
	getComboStatus,
	getPlayerById,
} = require("../controllers/player");
const router = Router();

router.post("/getPlayers", getPlayersData);
router.post("/getPlayersByTeam", getPlayersByTeam);
router.get("/getPlayersById", getPlayerById);
router.get("/getComboStatus", getComboStatus);

exports.Router = router;
