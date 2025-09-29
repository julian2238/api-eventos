const userServices = require("../services/userService");
const eventServices = require("../services/eventoService");
const categoryServices = require("../services/categoryService");

const getInitialData = async (req, res) => {
	try {
		const { uid, role } = req.user;

		const [
			listCategories,
			listAllEvents,
			listPopularEvents,
			listUpcomingEvents,
			listMyCreatedEvents,
			listFavorites,
			listParticipatedEvents,
			listHistoryEvents,
		] = await Promise.all([
			categoryServices.getCategories(),
			eventServices.getAllEvents(),
			eventServices.getPopularEvents(),
			eventServices.getUpcomingEvents(),
			eventServices.getMyCreatedEvents(uid),
			eventServices.getFavorites(uid),
			eventServices.getParticipatedEvents(uid),
			eventServices.getHistoryEvents(uid),
		]);

		res.status(200).send({
			status: true,
			message: "Solicitud exitosa",
			data: {
				listCategories,
				listAllEvents,
				listPopularEvents,
				listUpcomingEvents,
				listMyCreatedEvents,
				listFavorites,
				listParticipatedEvents,
				listHistoryEvents,
			},
		});
	} catch (error) {
		res.status(500).send({
			status: false,
			message: error.message || "Internal server error",
		});
	}
};

module.exports = {
	getInitialData,
};
