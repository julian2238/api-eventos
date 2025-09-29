const { db, admin } = require("../firebase");
const jwtUtils = require("../utils/jwt.utils");
const { default: axios } = require("axios");
const { saveRefreshToken, verifyRefreshToken } = require("./tokenService");

const createUser = async (data) => {
	return await admin.auth().createUser({
		email: data.email,
		password: data.password,
		displayName: data.fullName,
		phoneNumber: data.phone,
		disabled: false,
		emailVerified: false,
		uid: data.document,
	});
};

const login = async (email, password, platform) => {
	const URL = `${process.env.URL_SIGNIN}${process.env.API_KEY}`;
	let response = "";
	let token = "";
	let refreshToken = "";

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

	const role = userData.role || "USUARIO";

	token = jwtUtils.generateAccessToken(uid, role, platform);
	refreshToken = jwtUtils.generateRefreshToken(uid, role, platform);

	await saveRefreshToken(uid, refreshToken, platform);

	return {
		token,
		refreshToken,
		uid,
		fullName: userData.fullName,
		role: userData.role,
	};
};

const validateRefreshToken = async (refreshToken) => {
	const decoded = jwtUtils.verifyToken(refreshToken);

	const { uid, role, platform } = decoded;

	const isValid = await verifyRefreshToken(uid, refreshToken, platform);

	if (!isValid) {
		throw new Error("Invalid refresh token");
	}

	const newAccessToken = jwtUtils.generateAccessToken(uid, role, platform);
	const newRefreshToken = jwtUtils.generateRefreshToken(uid, role, platform);

	return {
		token: newAccessToken,
		refreshToken: newRefreshToken,
	};
};

/*---------- Functions ----------/

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
	createUser,
	login,
	validateRefreshToken,
};
