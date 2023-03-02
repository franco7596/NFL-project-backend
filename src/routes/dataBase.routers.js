const { Router } = require("express");
const {
	upDateDataBaseTeam,
	upDateDataBasePlayer,
} = require("../controllers/dataBase");
const { validarJWT } = require("../middlewares/auth.middlewares");

const router = Router();

router.post("/upDateTeam", validarJWT, upDateDataBaseTeam);
router.post("/upDateRoster", validarJWT, upDateDataBasePlayer);

exports.Router = router;
