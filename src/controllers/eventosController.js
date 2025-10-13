const { db } = require("../firebase");
const utils = require("../utils/utils");
const eventService = require("../services/eventoService");

const getEventos = async (_, res) => {
	try {
		const eventos = await eventService.getAllEvents(eventosSnap);

		if (eventos.length === 0) {
			return res.status(200).send({
				status: false,
				message: "No hay eventos registrados",
				data: [],
			});
		}

		res.status(200).send({
			status: true,
			message: "Eventos obtenidos correctamente",
			data: eventos,
		});
	} catch (error) {
		res.status(500).send({
			status: false,
			message: error.message || "Internal server error",
		});
	}
};

const getEventosById = async (req, res) => {
	try {
		const idEvento = req.params.id;

		//* Validar que se envíe el ID del evento
		if (!idEvento) {
			return res.status(400).send({
				status: false,
				message: "Falta el ID del evento",
			});
		}

		//* Obtener el evento por ID
		const eventoRef = db.collection("events").doc(idEvento);
		const eventoSnap = await eventoRef.get();

		if (!eventoSnap.exists) {
			return res.status(400).send({
				status: false,
				message: "Evento no encontrado",
			});
		}

		const dataEvento = { id: eventoSnap.id, ...eventoSnap.data() };

		delete data.dtCreation;
		delete data.createdBy;
		delete data.favoritesCount;

		res.status(200).send({
			status: true,
			message: "Evento obtenido correctamente",
			data: dataEvento,
		});
	} catch (error) {
		res.status(500).send({
			status: false,
			message: error.message || "Internal server error",
		});
	}
};

const postEventos = async (req, res) => {
	try {
		const data = req.body;

		if (!utils.validateFields(data, "event")) {
			return res.status(400).send({
				status: false,
				message: "Faltan campos requeridos",
			});
		}

		const result = await eventService.createEvent({ ...data, uid: req.user.uid });

		res.status(200).send({
			status: true,
			message: "Evento creado correctamente",
			data: result.id,
		});
	} catch (error) {
		res.status(500).send({
			status: false,
			message: error.message || "Internal server error",
		});
	}
};

const putEventos = async (req, res) => {
	try {
		const idEvento = req.params.id;
		const data = req.body;

		if (!idEvento) {
			return res.status(400).send({
				status: false,
				message: "Falta el ID del evento",
			});
		}

		if (!utils.validateFields(data, "event")) {
			return res.status(400).send({
				status: false,
				message: "Faltan campos requeridos",
			});
		}

		await eventService.updateEvent(idEvento, data);

		res.json({
			status: true,
			message: "Evento actualizado correctamente",
		});
	} catch (error) {
		res.status(500).send({
			status: false,
			message: error.message || "Internal server error",
		});
	}
};

const deleteEventos = async (req, res) => {
	try {
		const idEvento = req.params.id;

		if (!idEvento) {
			return res.status(400).send({
				status: false,
				message: "Falta el ID del evento",
			});
		}

		await eventService.deleteEvent(idEvento);

		res.status(200).send({
			status: true,
			message: "Evento eliminado correctamente",
		});
	} catch (error) {
		res.status(500).send({
			status: false,
			message: error.message || "Internal server error",
		});
	}
};

const participarEvento = async (req, res) => {
	try {
		const idEvento = req.params.id;
		const idUsuario = req.user.uid;

		if (!idEvento || !idUsuario) {
			return res.status(400).send({
				status: false,
				message: "Faltan campos requeridos",
			});
		}

		await eventService.addParticipant(idEvento, idUsuario);

		res.status(200).send({
			status: true,
			message: "Se ha unido al evento correctamente",
		});
	} catch (error) {
		res.status(500).send({
			status: false,
			message: error.message || "Internal server error",
		});
	}
};

const abandonarEvento = async (req, res) => {
	try {
		const idEvento = req.params.id;
		const idUsuario = req.user.uid;

		if (!idEvento || !idUsuario) {
			return res.status(400).send({
				status: false,
				message: "Faltan campos requeridos",
			});
		}

		await eventService.removeParticipant(idEvento, idUsuario);

		res.status(200).send({
			status: true,
			message: "Se ha abandonado el evento correctamente",
		});
	} catch (error) {
		res.status(500).send({
			status: false,
			message: error.message || "Internal server error",
		});
	}
};

const darFavorito = async (req, res) => {
	try {
		const idEvento = req.params.id;
		const idUsuario = req.user.uid;

		if (!idEvento || !idUsuario) {
			return res.status(400).send({
				status: false,
				message: "Faltan campos requeridos",
			});
		}

		await eventService.likeFavorite(idEvento, idUsuario);

		res.json({
			status: true,
			message: "Evento marcado como favorito correctamente",
			data: null,
		});
	} catch (error) {
		res.status(500).send({
			status: false,
			message: error.message || "Internal server error",
		});
	}
};

const quitarFavorito = async (req, res) => {
	try {
		const idEvento = req.params.id;
		const idUsuario = req.user.uid;

		if (!idEvento || !idUsuario) {
			return res.status(400).send({
				status: false,
				message: "Faltan campos requeridos",
			});
		}

		await eventService.unlikeFavorite(idEvento, idUsuario);

		res.json({
			status: true,
			message: "Evento quitado de favoritos correctamente",
			data: null,
		});
	} catch (error) {
		res.status(500).send({
			status: false,
			message: error.message || "Internal server error",
		});
	}
};

module.exports = {
	getEventos,
	getEventosById,
	postEventos,
	putEventos,
	deleteEventos,
	participarEvento,
	abandonarEvento,
	darFavorito,
	quitarFavorito,
};
