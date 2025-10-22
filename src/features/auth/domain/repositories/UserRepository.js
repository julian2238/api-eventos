class UserRepository {
  async create(user) {
    throw new Error('UserRepository.create() must be implemented');
  }

  async findByUid(uid) {
    throw new Error('UserRepository.findByUid() must be implemented');
  }

  async findByDocument(document) {
    throw new Error('UserRepository.findByDocument() must be implemented');
  }

  async findByEmail(email) {
    throw new Error('UserRepository.findByEmail() must be implemented');
  }

  async update(uid, userData) {
    throw new Error('UserRepository.update() must be implemented');
  }

  async delete(uid) {
    throw new Error('UserRepository.delete() must be implemented');
  }
}

module.exports = UserRepository;
