const { NotFoundError } = require('../../../../shared/errors/AppError');

class GetEventsUseCase {
  constructor(eventRepository) {
    this.eventRepository = eventRepository;
  }

  async execute(filters = {}) {
    try {
      const events = await this.eventRepository.findAll(filters);
      
      if (events.length === 0) {
        return {
          message: 'No hay eventos registrados',
          data: [],
        };
      }

      return {
        message: 'Eventos obtenidos correctamente',
        data: events.map(event => event.toPublicJSON()),
      };
    } catch (error) {
      throw new Error('Error obteniendo eventos: ' + error.message);
    }
  }
}

module.exports = GetEventsUseCase;
