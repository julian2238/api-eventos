const { NotFoundError, AuthorizationError } = require('../../../../shared/errors/AppError');

class DeleteEventUseCase {
  constructor(eventRepository) {
    this.eventRepository = eventRepository;
  }

  async execute(eventId, userId) {
    try {
      // Check if event exists
      const existingEvent = await this.eventRepository.findById(eventId);
      if (!existingEvent) {
        throw new NotFoundError('Evento');
      }

      // Check if user can delete the event
      if (!existingEvent.canBeModifiedBy(userId)) {
        throw new AuthorizationError('No tienes permisos para eliminar este evento');
      }

      // Delete event
      await this.eventRepository.delete(eventId);
      
      return {
        message: 'Evento eliminado correctamente',
      };
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof AuthorizationError) {
        throw error;
      }
      throw new Error('Error eliminando evento: ' + error.message);
    }
  }
}

module.exports = DeleteEventUseCase;
