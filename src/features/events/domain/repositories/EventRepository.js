class EventRepository {
  async create(event) {
    throw new Error('EventRepository.create() must be implemented');
  }

  async findById(id) {
    throw new Error('EventRepository.findById() must be implemented');
  }

  async findAll(filters = {}) {
    throw new Error('EventRepository.findAll() must be implemented');
  }

  async update(id, eventData) {
    throw new Error('EventRepository.update() must be implemented');
  }

  async delete(id) {
    throw new Error('EventRepository.delete() must be implemented');
  }

  async findPopular(limit = 5) {
    throw new Error('EventRepository.findPopular() must be implemented');
  }

  async findUpcoming(limit = 5) {
    throw new Error('EventRepository.findUpcoming() must be implemented');
  }

  async findByUser(uid, role) {
    throw new Error('EventRepository.findByUser() must be implemented');
  }

  async addParticipant(eventId, userId) {
    throw new Error('EventRepository.addParticipant() must be implemented');
  }

  async removeParticipant(eventId, userId) {
    throw new Error('EventRepository.removeParticipant() must be implemented');
  }

  async addFavorite(eventId, userId) {
    throw new Error('EventRepository.addFavorite() must be implemented');
  }

  async removeFavorite(eventId, userId) {
    throw new Error('EventRepository.removeFavorite() must be implemented');
  }

  async findFavorites(userId) {
    throw new Error('EventRepository.findFavorites() must be implemented');
  }

  async findUserEvents(userId) {
    throw new Error('EventRepository.findUserEvents() must be implemented');
  }
}

module.exports = EventRepository;
