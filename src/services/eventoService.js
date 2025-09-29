const { db, admin } = require("../firebase");
const { chunkArray } = require("../utils/utils");

const createEvent = async (data) => {
	const eventDate = new Date(`${data.date}T${data.hour}:00`);

	const newEvent = {
		title: data.title,
		description: data.description,
		category: data.category,
		date: admin.firestore.Timestamp.fromDate(eventDate),
		dtCreation: admin.firestore.FieldValue.serverTimestamp(),
		createdBy: data.uid,
		participantsCount: 0,
		favoritesCount: 0,
		status: "active",
		routes: data.routes || [],
	};

	const eventoRef = await db.collection("eventos").add(newEvent);

	return eventoRef;
};

const updateEvent = async (idEvento, newData) => {
	const eventoRef = db.collection("eventos").doc(idEvento);
	const eventoSnap = await eventoRef.get();

	if (!eventoSnap.exists) {
		throw new Error("Evento no encontrado");
	}

	const updatedData = {
		title: newData.title,
		description: newData.description,
		category: newData.category,
		date: admin.firestore.Timestamp.fromDate(new Date(`${newData.date}T${newData.hour}:00`)),
		routes: newData.routes || [],
	};

	await eventoRef.update(updatedData);

	console.log(`Evento ${idEvento} actualizado correctamente`);
};

const deleteEvent = async (idEvento) => {
	const eventoRef = db.collection("eventos").doc(idEvento);
	const eventoSnap = await eventoRef.get();

	if (!eventoSnap.exists) {
		throw new Error("Evento no encontrado");
	}

	await eventoRef.delete();
	console.log(`Evento ${idEvento} eliminado correctamente`);
};

const addParticipant = async (idEvento, idUsuario) => {
	const eventoRef = db.collection("eventos").doc(idEvento);

	const participanteRef = eventoRef.collection("participants").doc(idUsuario);

	const participanteSnap = await participanteRef.get();

	if (participanteSnap.exists) {
		throw new Error("El usuario ya es participante del evento");
	}

	const userSnap = await db.collection("users").doc(idUsuario).get();

	if (!userSnap.exists) {
		throw new Error("Usuario no encontrado");
	}

	const userData = userSnap.data();

	await participanteRef.set({
		...userData,
		joinedAt: admin.firestore.FieldValue.serverTimestamp(),
	});

	await eventoRef.update({
		participantsCount: admin.firestore.FieldValue.increment(1),
	});

	console.log(`Usuario ${idUsuario} agregado al evento ${idEvento}`);
};

const removeParticipant = async (idEvento, idUsuario) => {
	const eventoRef = db.collection("eventos").doc(idEvento);
	const participanteRef = eventoRef.collection("participants").doc(idUsuario);

	// Verificar si el participante existe
	const participanteSnap = await participanteRef.get();
	if (!participanteSnap.exists) {
		throw new Error("El usuario no está registrado en este evento");
	}

	// Eliminar al participante
	await participanteRef.delete();

	// Decrementar el contador de participantes
	await eventoRef.update({
		participantsCount: admin.firestore.FieldValue.increment(-1),
	});

	console.log(`Usuario ${idUsuario} eliminado del evento ${idEvento}`);
};

const getAllEvents = async () => {
	const querySnapshot = await db.collection("events").get();

	if (eventosSnap.empty) return [];

	return getDataEvent(querySnapshot);
};

const getPopularEvents = async () => {
	const querySnapshot = await db.collection("events").orderBy("participantsCount", "desc").limit(5).get();

	if (eventosSnap.empty) {
		return [];
	}

	return getDataEvent(querySnapshot);
};

const getUpcomingEvents = async () => {
	const currentDate = admin.firestore.Timestamp.now();
	const querySnapshot = await db.collection("events").where("date", ">=", currentDate).orderBy("date", "asc").limit(5).get();

	if (eventosSnap.empty) return [];

	return getDataEvent(querySnapshot);
};

const getFavorites = async (uid) => {
	let eventos = [];

	const querySnapshot = await db.collection("userFavorites").where("uid", "==", uid).get();

	if (querySnapshot.empty) return eventos;

	const idEvents = querySnapshot.docs.map((doc) => doc.data().idEvent);

	const chunks = chunkArray(idEvents, 10);

	for (const chunk of chunks) {
		const eventsSnap = await db.collection("eventos").where("__name__", "in", chunk).get();

		const data = getDataEvent(eventsSnap);

		eventos = eventos.concat(data);
	}

	return eventos;
};

const getMyCreatedEvents = async (uid) => {
	const querySnapshot = await db.collection("events").where("createdBy", "==", uid).get();

	if (eventosSnap.empty) return [];

	return getDataEvent(querySnapshot);
};

const getHistoryEvents = async (uid) => {
	let events = [];

	const querySnapshot = await db.collection("userEvents").where("uid", "==", uid).where("status", "==", "finished").get();

	if (querySnapshot.empty) return [];

	const idEvents = querySnapshot.docs.map((doc) => doc.data().idEvent);

	const chunks = chunkArray(idEvents, 10);

	for (const chunk of chunks) {
		const eventsSnap = await db.collection("eventos").where("__name__", "in", chunk).get();

		const data = getDataEvent(eventsSnap);

		events = events.concat(data);
	}

	return events;
};

const getParticipatedEvents = async (uid) => {
	let events = [];

	const querySnapshot = await db.collection("userEvents").where("uid", "==", uid).where("status", "==", "active").get();

	if (querySnapshot.empty) return [];

	const idEvents = querySnapshot.docs.map((doc) => doc.data().idEvent);

	const chunks = chunkArray(idEvents, 10);

	for (const chunk of chunks) {
		const eventsSnap = await db.collection("eventos").where("__name__", "in", chunk).get();

		const data = getDataEvent(eventsSnap);

		events = events.concat(data);
	}

	return events;
};

/** FUNCTIONS **/

/**
 *
 * @param {*} querySnapshot
 * @returns {Array} Array de eventos.
 */
const getDataEvent = (querySnapshot) => {
	const eventos = [];

	for (const doc of querySnapshot.docs) {
		const data = doc.data();

		delete data.dtCreation;
		delete data.createdBy;
		delete data.favoritesCount;

		const dateObj = data.date.toDate();

		return {
			...data,
			id: data.id,
			date: dateObj.toISOString().split("T")[0],
			hour: dateObj.toTimeString().split(" ")[0].slice(0, 5),
		};
	}

	return eventos;
};

module.exports = {
	createEvent,
	updateEvent,
	deleteEvent,
	addParticipant,
	removeParticipant,
	getAllEvents,
	getPopularEvents,
	getUpcomingEvents,
	getFavorites,
	getMyCreatedEvents,
	getHistoryEvents,
	getParticipatedEvents,
	getDataEvent,
};
