const { ValidationError } = require('../../../../shared/errors/AppError');
const Event = require('../../domain/Event');

class CreateEventUseCase {
  constructor(eventRepository) {
    this.eventRepository = eventRepository;
  }

  async execute(eventData, createdBy) {
    try {
      // Create domain event
      const event = Event.createFromRequest(eventData, createdBy);
      
      // Save to repository
      const createdEvent = await this.eventRepository.create(event);
      
      return {
        message: 'Evento creado correctamente',
        data: { id: createdEvent.id },
      };
    } catch (error) {
      throw new ValidationError('No se pudo crear el evento: ' + error.message);
    }
  }
}

module.exports = CreateEventUseCase;
