const { Router } = require("express");
const {
	upDateDataBaseTeam,
	upDateDataBasePlayer,
} = require("../controllers/dataBase");

const router = Router();

router.post("/upDateTeam", upDateDataBaseTeam);
router.post("/upDateRoster", upDateDataBasePlayer);

exports.Router = router;
