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

const { validarJWT } = require("../middleware/auth.middleware");

const router = Router();

router.get("/", validarJWT, getEventos);

router.get("/:id", validarJWT, getEventosById);

router.post("/participar", validarJWT, participarEvento);

router.delete("/abandonar", validarJWT, abandonarEvento);

router.post("/", validarJWT, postEventos);

router.put("/:id", validarJWT, putEventos);

router.delete("/:id", validarJWT, deleteEventos);

module.exports = router;
