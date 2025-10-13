const Router = require("express");
const {
	getEventos,
	getEventosById,
	postEventos,
	putEventos,
	deleteEventos,
	participarEvento,
	abandonarEvento,
	darFavorito,
	quitarFavorito,
} = require("../controllers/eventosController");

const { validarJWT, checkRole } = require("../middleware/auth.middleware");

const router = Router();

router.get("/", validarJWT, getEventos);

router.get("/:id", validarJWT, getEventosById);

router.post("/", validarJWT, checkRole, postEventos);

router.put("/:id", validarJWT, checkRole, putEventos);

router.delete("/:id", validarJWT, checkRole, deleteEventos);

router.post("/participar/:id", validarJWT, participarEvento);

router.delete("/participar/:id", validarJWT, abandonarEvento);

router.post("/favorito/:id", validarJWT, darFavorito);

router.delete("/favorito/:id", validarJWT, quitarFavorito);

module.exports = router;
