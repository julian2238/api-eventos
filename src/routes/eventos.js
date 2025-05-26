const Router = require('express');
const { getEventos, getEventosById, postEventos, putEventos, deleteEventos } = require('../controllers/eventosController');

const router = Router();

router.get('/', getEventos);

router.get('/:id', getEventosById);

router.post('/', postEventos);

router.put('/:id', putEventos);

router.delete('/:id', deleteEventos);

module.exports = router;