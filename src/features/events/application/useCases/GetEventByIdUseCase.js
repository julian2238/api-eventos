const { NotFoundError } = require('../../../../shared/errors/AppError');

class GetEventByIdUseCase {
  constructor(eventRepository) {
    this.eventRepository = eventRepository;
  }

  async execute(eventId) {
    try {
      const event = await this.eventRepository.findById(eventId);
      
      if (!event) {
        throw new NotFoundError('Evento');
      }

      return {
        message: 'Evento obtenido correctamente',
        data: event.toPublicJSON(),
      };
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new Error('Error obteniendo evento: ' + error.message);
    }
  }
}

module.exports = GetEventByIdUseCase;
