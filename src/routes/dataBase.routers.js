const { Router } = require("express");
const { upDateDataBaseTeam } = require("../controllers/dataBase");

const router = Router();

router.get("/upDateTeam", upDateDataBaseTeam);

exports.Router = router;
