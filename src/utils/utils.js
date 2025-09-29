const { schemas } = require("../validations/schemas");

/**
 *
 * @returns {string} date in format YYYY-MM-DD
 * @description Devuelve la fecha actual en formato YYYY-MM-DD.
 */
const getDate = () => {
	return new Date().toISOString().substring(0, 10);
};

/**
 *
 * @param {*} data to validate
 * @param {*} type of schema
 * @returns {boolean} true if all fields are present, false otherwise
 * @description Valida si todos los campos requeridos están presentes.
 */
const validateFields = (data, type) => {
	return schemas[type].every((field) => data.hasOwnProperty(field));
};

/**
 *
 * @param {*} array para dividir
 * @param {*} size tamaño de cada chunk
 * @returns {Array} array de chunks
 * @description Divide un array en varios arrays más pequeños de un tamaño específico.
 */
const chunkArray = (array, size) => {
	const result = [];
	for (let i = 0; i < array.length; i += size) {
		result.push(array.slice(i, i + size));
	}
	return result;
};

module.exports = {
	getDate,
	validateFields,
	chunkArray,
};
