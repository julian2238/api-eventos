const userService = require("../services/userService");

const getUsers = async (_, res) => {
	try {
		const users = await userService.getUsers();

		res.status(200).send({
			status: true,
			message: "Usuarios obtenidos correctamente",
			data: users,
		});
	} catch (error) {
		res.status(500).send({
			status: false,
			message: error.message || "Internal server error",
		});
	}
};

const getUserById = async (req, res) => {
	try {
		const { id } = req.params;

		if (!id) {
			return res.status(400).send({
				status: false,
				message: "Falta el ID del usuario",
			});
		}

		const user = await userService.getUserById(id);

		res.status(200).send({
			status: true,
			message: "Usuario obtenido correctamente",
			data: user,
		});
	} catch (error) {
		res.status(500).send({
			status: false,
			message: error.message || "Internal server error",
		});
	}
};

const updateUser = async (req, res) => {
	try {
		const { id } = req.params;
		const data = req.body;

		if (!id) {
			return res.status(400).send({
				status: false,
				message: "Falta el ID del usuario",
			});
		}

		if (!data || Object.keys(data).length === 0) {
			return res.status(400).send({
				status: false,
				message: "Faltan datos para actualizar",
			});
		}

		const updatedUser = await userService.updateUser(id, data);

		res.status(200).send({
			status: true,
			message: "Usuario actualizado correctamente",
			data: updatedUser,
		});
	} catch (error) {
		res.status(500).send({
			status: false,
			message: error.message || "Internal server error",
		});
	}
};

module.exports = {
	getUsers,
	getUserById,
	updateUser,
};
