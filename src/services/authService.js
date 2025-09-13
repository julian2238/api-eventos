const { saveRefreshToken } = require("./tokenService");
const { db, admin } = require("../firebase");
const { getDate } = require("../utils/utils");
const jwtUtils = require("../utils/jwt.utils");
const { default: axios } = require("axios");

const login = async (email, password, platform) => {
	const URL = `${process.env.URL_SIGNIN}${process.env.API_KEY}`;
	let response = "";

	try {
		response = await axios.post(URL, {
			email,
			password,
			returnSecureToken: true,
		});
	} catch (error) {
		const firebaseError = error.response?.data?.error;
		const message = firebaseError?.message || "Error desconocido de autenticación";

		throw new Error(message);
	}

	const { localId: uid } = response.data;

	const userData = await getUserDataByUid(uid);

	if (!userData) throw new Error("No existe el usuario.");

	if (platform === "web" && userData.role !== "ADMIN") throw new Error("No autorizado.");

	const token = jwtUtils.generateAccessToken(uid, userData.role);
	const refreshToken = jwtUtils.generateRefreshToken(uid, userData.role);

	await saveRefreshToken(uid, refreshToken);

	return {
		token,
		refreshToken,
		uid,
		fullName: userData.fullName,
		role: userData.role,
	};
};

/** Functions **/
/**
 *
 * @param {string} uid
 * @returns { object | boolean }
 */
const getUserDataByUid = async (uid) => {
	const user = await db.collection("users").doc(uid).get();

	if (!user.exists) {
		return false;
	}

	return user.data();
};

module.exports = {
	login,
};
