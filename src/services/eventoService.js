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

	const eventoRef = await db.collection("events").add(newEvent);

	return eventoRef;
};

const updateEvent = async (idEvento, newData) => {
	const eventoRef = db.collection("events").doc(idEvento);
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
};

const deleteEvent = async (idEvento) => {
	const eventoRef = db.collection("events").doc(idEvento);
	const eventoSnap = await eventoRef.get();

	if (!eventoSnap.exists) {
		throw new Error("Evento no encontrado");
	}

	await eventoRef.delete();
};

const addParticipant = async (idEvento, idUsuario) => {
	const userEventRef = db.collection("userEvents").doc(`${idUsuario}_${idEvento}`);

	const userEventSnap = await userEventRef.get();

	if (userEventSnap.exists) return;

	userEventRef.set({
		uid: idUsuario,
		idEvent: idEvento,
		joinedAt: admin.firestore.FieldValue.serverTimestamp(),
	});

	const eventoRef = db.collection("events").doc(idEvento);
	const participanteRef = eventoRef.collection("participants").doc(idUsuario);

	await eventoRef.update({
		participantsCount: admin.firestore.FieldValue.increment(1),
	});

	await participanteRef.set({
		uid: idUsuario,
		joinedAt: admin.firestore.FieldValue.serverTimestamp(),
		status: "active",
	});
};

const removeParticipant = async (idEvento, idUsuario) => {
	const userEventRef = db.collection("userEvents").doc(`${idUsuario}_${idEvento}`);

	const userEventSnap = await userEventRef.get();

	if (userEventSnap.exists) {
		await userEventRef.delete();

		const eventoRef = db.collection("events").doc(idEvento);
		const participanteRef = eventoRef.collection("participants").doc(idUsuario);
		const participanteSnap = await participanteRef.get();

		await eventoRef.update({
			participantsCount: admin.firestore.FieldValue.increment(-1),
		});

		if (participanteSnap.exists) {
			await participanteRef.delete();
		}
	}
};

const likeFavorite = async (idEvento, idUsuario) => {
	const favoriteRef = db.collection("userFavorites").doc(`${idUsuario}_${idEvento}`);

	const favoriteSnap = await favoriteRef.get();

	if (!favoriteSnap.exists) {
		favoriteRef.set({
			uid: idUsuario,
			idEvent: idEvento,
			favoriteAt: admin.firestore.FieldValue.serverTimestamp(),
		});
	}

	const eventoRef = db.collection("events").doc(idEvento);

	await eventoRef.update({
		favoritesCount: admin.firestore.FieldValue.increment(1),
	});
};

const unlikeFavorite = async (idEvento, idUsuario) => {
	const favoriteRef = db.collection("userFavorites").doc(`${idUsuario}_${idEvento}`);
	const favoriteSnap = await favoriteRef.get();

	if (favoriteSnap.exists) {
		await favoriteRef.delete();
	}

	const eventoRef = db.collection("events").doc(idEvento);

	await eventoRef.update({
		favoritesCount: admin.firestore.FieldValue.increment(-1),
	});
};

const getAllEvents = async () => {
	try {
		const querySnapshot = await db.collection("events").get();

		if (querySnapshot.empty) return [];

		return getDataEvent(querySnapshot);
	} catch (error) {
		throw new Error("Error obteniendo eventos");
	}
};

const getPopularEvents = async () => {
	try {
		const eventRef = db.collection("events");
		const querySnapshot = await eventRef.where("status", "==", "active").orderBy("participantsCount", "desc").limit(5).get();

		if (querySnapshot.empty) return [];

		// Campos a retornar
		const fields = ["id", "title", "date", "hour", "category", "participantsCount"];

		return getDataEvent(querySnapshot, fields);
	} catch (error) {
		throw new Error("Error obteniendo eventos populares");
	}
};

const getUpcomingEvents = async () => {
	try {
		const currentDate = admin.firestore.Timestamp.now();
		const querySnapshot = await db
			.collection("events")
			.where("date", ">=", currentDate)
			.orderBy("date", "asc")
			.limit(5)
			.get();

		if (querySnapshot.empty) return [];

		// Campos a retornar
		const fields = ["id", "title", "category", "date", "hour"];

		return getDataEvent(querySnapshot, fields);
	} catch (error) {
		throw new Error("Error obteniendo próximos eventos");
	}
};

const getFavorites = async (uid) => {
	try {
		let eventos = [];
		const fields = ["id", "title", "description", "category", "date", "hour", "participantsCount"];

		const eventRef = db.collection("userFavorites");
		const querySnapshot = await eventRef.where("uid", "==", uid).get();

		if (querySnapshot.empty) return eventos;

		const idEvents = querySnapshot.docs.map((doc) => doc.data().idEvent);

		const chunks = chunkArray(idEvents, 10);

		for (const chunk of chunks) {
			const eventsSnap = await db.collection("events").where("__name__", "in", chunk).get();
			const data = getDataEvent(eventsSnap, fields);

			eventos = eventos.concat(data);
		}

		return eventos;
	} catch (error) {
		throw new Error("Error obteniendo eventos favoritos");
	}
};

const getHistoryEvents = async (uid) => {
	try {
		let events = [];

		const eventRef = db.collection("userEvents");
		const querySnapshot = await eventRef.where("uid", "==", uid).where("status", "==", "finished").get();

		if (querySnapshot.empty) return [];

		const idEvents = querySnapshot.docs.map((doc) => doc.data().idEvent);

		const chunks = chunkArray(idEvents, 10);

		for (const chunk of chunks) {
			const eventsSnap = await db.collection("events").where("__name__", "in", chunk).get();

			const data = getDataEvent(eventsSnap);

			events = events.concat(data);
		}

		return events;
	} catch (error) {
		throw new Error("Error obteniendo eventos históricos");
	}
};

const getMyEvents = async (uid, role) => {
	try {
		const fields = ["id", "title", "category", "participantsCount"];

		if (role === "ADMIN" || role === "COORDINADOR") {
			const eventRef = db.collection("events");
			const querySnapshot = await eventRef.where("createdBy", "==", uid).get();

			if (querySnapshot.empty) return [];

			return getDataEvent(querySnapshot);
		}

		const eventRef = db.collection("userEvents");
		const querySnapshot = await eventRef.where("uid", "==", uid).where("status", "==", "active").get();

		if (!querySnapshot.empty) {
			return getDataEvent(querySnapshot);
		}

		return [];
	} catch (error) {
		throw new Error("Error obteniendo mis eventos");
	}
};

/** FUNCTIONS **/

/**
 *
 * @param {*} querySnapshot
 * @returns {Array} Array de eventos.
 */
const getDataEvent = (querySnapshot, fields = null) => {
	const eventos = [];

	for (const doc of querySnapshot.docs) {
		const data = doc.data();

		delete data.dtCreation;
		delete data.createdBy;
		delete data.favoritesCount;

		const dateObj = data.date.toDate();

		const event = {
			...data,
			id: doc.id,
			date: dateObj.toISOString().split("T")[0],
			hour: dateObj.toTimeString().split(" ")[0].slice(0, 5),
		};

		console.log(event);

		if (fields) {
			const filteredEvent = {};
			fields.forEach((field) => {
				if (event.hasOwnProperty(field)) {
					filteredEvent[field] = event[field];
				}
			});

			eventos.push(filteredEvent);
		} else {
			eventos.push(event);
		}
	}

	return eventos;
};

module.exports = {
	createEvent,
	updateEvent,
	deleteEvent,
	addParticipant,
	removeParticipant,
	likeFavorite,
	unlikeFavorite,
	getAllEvents,
	getPopularEvents,
	getUpcomingEvents,
	getFavorites,
	getHistoryEvents,
	getDataEvent,
	getMyEvents,
};
