const Router = require("express");
const { validarJWT } = require("../middleware/auth.middleware");
const { getInitialData } = require("../controllers/homeController");

const router = Router();

router.get("/", validarJWT, getInitialData);

module.exports = router;
