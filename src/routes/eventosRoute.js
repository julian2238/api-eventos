const Router = require("express");
const {
	getEventos,
	getEventosById,
	postEventos,
	putEventos,
	deleteEventos,
	participarEvento,
	abandonarEvento,
} = require("../controllers/eventosController");

const { validarJWT, checkRole } = require("../middleware/auth.middleware");

const router = Router();

router.get("/", validarJWT, getEventos);

router.get("/:id", validarJWT, getEventosById);

router.post("/participar", validarJWT, participarEvento);

router.delete("/abandonar", validarJWT, checkRole, abandonarEvento);

router.post("/", validarJWT, checkRole, postEventos);

router.put("/:id", validarJWT, checkRole, putEventos);

router.delete("/:id", validarJWT, checkRole, deleteEventos);

module.exports = router;
