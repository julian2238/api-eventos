const Router = require("express");
const { signUp, signIn, refreshToken } = require("../controllers/authController");

const router = Router();

router.post("/signup", signUp);

router.post("/signin", signIn);

router.post("/refreshToken", refreshToken);

module.exports = router;
