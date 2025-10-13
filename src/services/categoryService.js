const { db } = require("../firebase");

const getCategories = async () => {
	try {
		const categoriesSnap = await db.collection("categories").get();

		const categories = [];

		categoriesSnap.forEach((doc) => {
			categories.push({ ...doc.data() });
		});

		return categories;
	} catch (error) {
		throw new Error("Error obteniendo categorías");
	}
};

module.exports = {
	getCategories,
};
