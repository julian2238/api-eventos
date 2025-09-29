const categoryService = require("../services/categoryService");

const getCategories = async (_, res) => {
	try {
		const response = await categoryService.getCategories();

		res.json({
			status: true,
			message: "Categorías obtenidas correctamente",
			data: response,
		});
	} catch (error) {
		res.status(500).send({
			status: false,
			message: error.message || "Internal server error",
		});
	}
};

module.exports = {
	getCategories,
};
