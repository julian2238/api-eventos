const { Router } = require("express");
const { getUsers, getUserById } = require("../controllers/userController");
const { validarJWT } = require("../middleware/auth.middleware");

const router = Router;

router.get("/", validarJWT, getUsers);

router.get("/:id", validarJWT, getUserById);

module.exports = router;
