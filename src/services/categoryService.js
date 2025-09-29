const { db } = require("../firebase");

const getCategories = async () => {
	const categoriesSnap = await db.collection("categories").get();

	const categories = [];

	categoriesSnap.forEach((doc) => {
		categories.push({ ...doc.data() });
	});

	return categories;
};

module.exports = {
	getCategories,
};
