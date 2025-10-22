const { NotFoundError } = require('../../../../shared/errors/AppError');

class LeaveEventUseCase {
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

      // Remove participant
      await this.eventRepository.removeParticipant(eventId, userId);
      
      return {
        message: 'Has abandonado el evento correctamente',
      };
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new Error('Error abandonando el evento: ' + error.message);
    }
  }
}

module.exports = LeaveEventUseCase;
