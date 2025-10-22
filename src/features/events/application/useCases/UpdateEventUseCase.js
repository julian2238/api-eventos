const { NotFoundError, AuthorizationError } = require('../../../../shared/errors/AppError');

class UpdateEventUseCase {
  constructor(eventRepository) {
    this.eventRepository = eventRepository;
  }

  async execute(eventId, eventData, userId) {
    try {
      // Check if event exists
      const existingEvent = await this.eventRepository.findById(eventId);
      if (!existingEvent) {
        throw new NotFoundError('Evento');
      }

      // Check if user can modify the event
      if (!existingEvent.canBeModifiedBy(userId)) {
        throw new AuthorizationError('No tienes permisos para modificar este evento');
      }

      // Update event
      await this.eventRepository.update(eventId, eventData);
      
      return {
        message: 'Evento actualizado correctamente',
      };
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof AuthorizationError) {
        throw error;
      }
      throw new Error('Error actualizando evento: ' + error.message);
    }
  }
}

module.exports = UpdateEventUseCase;
