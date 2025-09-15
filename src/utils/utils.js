const { schemas } = require("../validations/schemas");

//Return date in format YYYY-MM-DD
const getDate = () => {
	return new Date().toISOString().substring(0, 10);
};

// Validate if all required fields are present
const validateFields = (data, type) => {
	return schemas[type].every((field) => data.hasOwnProperty(field));
};

module.exports = {
	getDate,
	validateFields,
};
