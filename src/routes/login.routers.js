const { Router } = require("express");
const { loginController } = require("../controllers/auth/auth.controller");

const router = Router();

router.post("/login", loginController);

exports.Router = router;
