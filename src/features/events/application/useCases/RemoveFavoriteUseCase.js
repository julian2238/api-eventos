const { NotFoundError } = require('../../../../shared/errors/AppError');

class RemoveFavoriteUseCase {
  constructor(eventRepository) {
    this.eventRepository = eventRepository;
  }

  async execute(eventId, userId) {
    try {
      // Check if event exists
      const event = await this.eventRepository.findById(eventId);
      if (!event) {
        throw new NotFoundError('Evento');
      }

      // Remove favorite
      await this.eventRepository.removeFavorite(eventId, userId);
      
      return {
        message: 'Evento quitado de favoritos correctamente',
      };
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new Error('Error quitando de favoritos: ' + error.message);
    }
  }
}

module.exports = RemoveFavoriteUseCase;
