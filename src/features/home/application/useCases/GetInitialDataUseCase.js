class GetInitialDataUseCase {
  constructor(
    categoryRepository,
    eventRepository,
    userRepository
  ) {
    this.categoryRepository = categoryRepository;
    this.eventRepository = eventRepository;
    this.userRepository = userRepository;
  }

  async execute(userId, userRole) {
    try {
      const [
        categories,
        allEvents,
        popularEvents,
        upcomingEvents,
        myEvents,
        favoriteEvents,
        historyEvents,
      ] = await Promise.all([
        this.categoryRepository.findAll(),
        this.eventRepository.findAll(),
        this.eventRepository.findPopular(),
        this.eventRepository.findUpcoming(),
        this.eventRepository.findByUser(userId, userRole),
        this.eventRepository.findFavorites(userId),
        this.eventRepository.findUserEvents(userId),
      ]);

      return {
        message: 'Datos iniciales obtenidos correctamente',
        data: {
          listCategories: categories.map(cat => cat.toJSON()),
          listAllEvents: allEvents.map(event => event.toPublicJSON()),
          listPopularEvents: popularEvents.map(event => event.toPublicJSON()),
          listUpcomingEvents: upcomingEvents.map(event => event.toPublicJSON()),
          listMyEvents: myEvents.map(event => event.toPublicJSON()),
          listFavoriteEvents: favoriteEvents.map(event => event.toPublicJSON()),
          listHistoryEvents: historyEvents.map(event => event.toPublicJSON()),
        },
      };
    } catch (error) {
      throw new Error('Error obteniendo datos iniciales: ' + error.message);
    }
  }
}

module.exports = GetInitialDataUseCase;
