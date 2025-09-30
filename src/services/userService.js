const { db } = require("../firebase");

const getUsers = async () => {
	const usersSnapshot = await db.collection("users").get();

	if (usersSnapshot.empty) return [];

	const users = [];

	usersSnapshot.forEach((doc) => {
		const data = doc.data();
		delete data.dtCreation;
		users.push(data);
	});

	return users;
};

const getUserById = async (uid) => {
	const userSnapshot = await db.collection("users").doc(uid).get();

	if (!userSnapshot.exists) throw new Error("Usuario no encontrado.");

	const data = userSnapshot.data();

	delete data.dtCreation;

	return data;
};

const updateUser = async (uid, data) => {
	const userRef = db.collection("users").doc(uid);

	await userRef.update(data);

	return await getUserById(uid);
};

/**
 * Insert user data in firestore
 * @param {string} uid
 * @param {object} data
 */
const insertUser = async (uid, data) => {
	delete data.password;

	const userData = {
		...data,
		role: "USUARIO",
		dtCreation: utils.getDate(),
	};

	await db.collection("users").doc(uid).set(userData);
};

/**
 * Verify if user exists with document number
 * @param {string} document
 * @returns {boolean}
 */
const verifyUser = async (document) => {
	const user = await db.collection("users").doc(document).get();

	return user.exists;
};

module.exports = {
	getUsers,
	getUserById,
	updateUser,
	verifyUser,
	insertUser,
};
