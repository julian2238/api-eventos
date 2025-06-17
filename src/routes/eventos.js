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

const router = Router();

router.get("/", getEventos);

router.get("/:id", getEventosById);

router.post("/participar", participarEvento);

router.delete("/abandonar", abandonarEvento);

router.post("/", postEventos);

router.put("/:id", putEventos);

router.delete("/:id", deleteEventos);

module.exports = router;
