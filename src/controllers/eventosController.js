
const getEventos = (req, res) => {
    try {
        
    } catch (error) {
        res.status(500).send(error.message || 'Internal server error');
    }
};

const getEventosById = (req, res) => {};

const postEventos = (req, res) => {};

const putEventos = (req, res) => {};

const deleteEventos = (req, res) => {};

module.exports = {
    getEventos,
    getEventosById,
    postEventos,
    putEventos,
    deleteEventos
}