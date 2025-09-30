const { Router } = require("express");
const { getUsers, getUserById, updateUser } = require("../controllers/userController");
const { validarJWT, checkRole } = require("../middleware/auth.middleware");

const router = Router;

router.get("/", validarJWT, getUsers);

router.get("/:id", validarJWT, getUserById);

router.put("/:id", validarJWT, checkRole, updateUser);

module.exports = router;
