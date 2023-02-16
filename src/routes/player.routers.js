const { Router } = require("express");
const { getPlayersData, getPlayersByTeam } = require("../controllers/player");
const router = Router();

router.get("/getPlayers", getPlayersData);
router.get("/getPlayersByTeam", getPlayersByTeam);

exports.Router = router;
