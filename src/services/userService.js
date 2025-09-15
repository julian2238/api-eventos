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
	verifyUser,
	insertUser,
};
