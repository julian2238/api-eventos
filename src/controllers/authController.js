const utils = require("../utils/utils");
const authService = require("../services/authService");
const userService = require("../services/userService");

const signUp = async (req, res) => {
	try {
		const data = req.body;

		if (!utils.validateFields(data, "user")) {
			return res.status(400).send({
				status: false,
				message: "Faltan campos requeridos",
			});
		}

		const userExist = await userService.verifyUser(data.document);

		if (!userExist) {
			return res.send({
				status: false,
				message: "Ya existe un usuario con ese documento",
			});
		}

		const result = await authService.createUser(data);

		if (!result) {
			res.send({
				status: false,
				message: "No se pudo crear el usuario",
			});
		}

		await userService.insertUser(result.uid, data);

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
		const { email, password, platform } = req.body;

		if (!email || !password || !platform) {
			return res.status(400).send({
				status: false,
				message: "Faltan campos requeridos",
			});
		}

		const data = await authService.login(email, password, platform);

		res.send({
			status: true,
			message: "Usuario autenticado correctamente",
			data,
		});
	} catch (error) {
		console.log(error);
		res.status(500).send({
			status: false,
			message: error.message,
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

		const data = authService.validateRefreshToken(refreshToken);

		return res.json({
			status: true,
			message: "Tokens actualizado correctamente.",
			data,
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

module.exports = {
	signUp,
	signIn,
	refreshToken,
};
