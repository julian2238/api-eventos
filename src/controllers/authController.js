const { default: axios } = require("axios");
const { db, admin } = require("../firebase");
const { getDate } = require("../utils/utils");
const jwtUtils = require("../utils/jwt.utils");

const signUp = async (req, res) => {
	try {
		const data = req.body;

		if (!verifyFieldsUser(data)) {
			return res.status(400).send({
				status: false,
				message: "Faltan campos requeridos",
			});
		}

		if (await verifyUser(data.document)) {
			return res.send({
				status: false,
				message: "Ya existe un usuario con ese documento",
			});
		}

		const result = await admin.auth().createUser({
			email: data.email,
			password: data.password,
			displayName: data.fullName,
			phoneNumber: data.phone,
			disabled: false,
			emailVerified: false,
			uid: data.document,
		});

		if (!result) {
			res.send({
				status: false,
				message: "No se pudo crear el usuario",
			});
		}

		await insertUser(result.uid, data);

		res.send({
			status: true,
			message: "Usuario creado correctamente",
		});
	} catch (error) {
		console.log(error);
		res.status(500).send({
			status: false,
			message: "Error al crear el usuario",
		});
	}
};

const signIn = async (req, res) => {
	try {
		const { email, password } = req.body;
		const URL = `${process.env.URL_SIGNIN}${process.env.API_KEY}`;

		const response = await axios.post(URL, {
			email,
			password,
			returnSecureToken: true,
		});

		const { localId: uid } = response.data;

		const userData = await getUserDataByUid(uid);

		if (!userData) {
			return res.send({
				status: false,
				message: "No existe el usuario.",
			});
		}

		const token = jwtUtils.generateAccessToken(uid);
		const refreshToken = jwtUtils.generateRefreshToken(uid);

		res.send({
			status: true,
			message: "Usuario autenticado correctamente",
			data: {
				...userData,
				token,
				refreshToken,
				uid,
			},
		});
	} catch (error) {
		console.log(error);
		const firebaseError = error.response?.data?.error;

		const message = firebaseError?.message || "Error desconocido de autenticación";

		res.status(400).send({
			status: false,
			message,
		});
	}
};

const refreshToken = async (req, res) => {
	try {
		const { refreshToken } = req.body;

		if (!refreshToken) {
			return res.status(401).send({
				status: false,
				message: "Refresh token is required",
			});
		}

		const decoded = jwtUtils.verifyToken(refreshToken);
		const uid = decoded.uid;

		const newAccessToken = jwtUtils.generateAccessToken(uid);
		const newRefreshToken = jwtUtils.generateRefreshToken(uid);

		return res.json({
			status: true,
			message: "Tokens refreshed successfully",
			data: {
				accessToken: newAccessToken,
				refreshToken: newRefreshToken,
			},
		});
	} catch (error) {
		if (error.name === "TokenExpiredError") {
			return res.status(401).send({
				status: false,
				message: "Refresh token expired",
			});
		}
		return res.status(401).json({
			status: false,
			message: "Invalid refresh token",
		});
	}
};

/* ---------------FUNCTIONS--------------- */

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
		dtCreation: getDate(),
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

/**
 * Verify fields required in user data
 * @param {object} data
 * @returns {boolean}
 */
const verifyFieldsUser = (data) => {
	const { fullName, email, password, phone, document, gender, birthDate } = data;

	if (!fullName || !email || !password || !phone || !document || !gender || !birthDate) {
		return false;
	}

	return true;
};

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
	signUp,
	signIn,
	refreshToken,
};
