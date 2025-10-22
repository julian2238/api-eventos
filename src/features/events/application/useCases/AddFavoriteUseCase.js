const { NotFoundError, ConflictError } = require('../../../../shared/errors/AppError');

class AddFavoriteUseCase {
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

      // Add favorite
      await this.eventRepository.addFavorite(eventId, userId);
      
      return {
        message: 'Evento marcado como favorito correctamente',
      };
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      if (error.message.includes('already exists')) {
        throw new ConflictError('El evento ya está en tus favoritos');
      }
      throw new Error('Error marcando como favorito: ' + error.message);
    }
  }
}

module.exports = AddFavoriteUseCase;
