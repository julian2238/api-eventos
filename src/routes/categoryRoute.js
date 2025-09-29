const Router = require("express");
const { validarJWT } = require("../middleware/auth.middleware");
const { getCategories } = require("../controllers/categoryController");

const router = Router();

router.get("/", validarJWT, getCategories);

module.exports = router;
