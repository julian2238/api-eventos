const { NotFoundError, ConflictError } = require('../../../../shared/errors/AppError');

class ParticipateInEventUseCase {
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

      // Add participant
      await this.eventRepository.addParticipant(eventId, userId);
      
      return {
        message: 'Te has unido al evento correctamente',
      };
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      if (error.message.includes('already exists')) {
        throw new ConflictError('Ya estás participando en este evento');
      }
      throw new Error('Error uniéndose al evento: ' + error.message);
    }
  }
}

module.exports = ParticipateInEventUseCase;
