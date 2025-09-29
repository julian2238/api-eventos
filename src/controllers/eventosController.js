const { db, admin } = require("../firebase");
const {
	createEvent,
	addParticipant,
	removeParticipant,
	updateEvent,
	deleteEvent,
	getAllEvents,
	obtenerDataEvento,
} = require("../services/eventoService");
const utils = require("../utils/utils");

const getEventos = async (_, res) => {
	try {
		const eventos = await getAllEvents(eventosSnap);

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
		const eventoRef = db.collection("eventos").doc(idEvento);
		const eventoSnap = await eventoRef.get();

		if (!eventoSnap.exists) {
			return res.status(400).send({
				status: false,
				message: "Evento no encontrado",
			});
		}

		//* Obtener las rutas asociadas al evento
		const routesSnap = await eventoRef.collection("routes").get();
		const routes = routesSnap.docs.map((doc) => doc.data());

		//* Formatear la respuesta del evento
		const dataEvento = eventoSnap.data();
		dataEvento.routes = routes;

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

const participarEvento = async (req, res) => {
	try {
		const { idEvento, idUsuario } = req.body;

		if (!idEvento || !idUsuario) {
			return res.status(400).send({
				status: false,
				message: "Faltan campos requeridos",
			});
		}

		await addParticipant(idEvento, idUsuario);

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
		const { idEvento, idUsuario } = req.body;

		if (!idEvento || !idUsuario) {
			return res.status(400).send({
				status: false,
				message: "Faltan campos requeridos",
			});
		}

		await removeParticipant(idEvento, idUsuario);

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

const postEventos = async (req, res) => {
	try {
		const data = req.body;

		if (!utils.validateFields(data, "event")) {
			return res.status(400).send({
				status: false,
				message: "Faltan campos requeridos",
			});
		}

		const result = await createEvent({ ...data, uid: req.user.uid });

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

		await updateEvent(idEvento, data);

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

		await deleteEvent(idEvento);

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

module.exports = {
	getEventos,
	getEventosById,
	participarEvento,
	abandonarEvento,
	postEventos,
	putEventos,
	deleteEventos,
};
