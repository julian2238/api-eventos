class CategoryRepository {
  async create(category) {
    throw new Error('CategoryRepository.create() must be implemented');
  }

  async findById(id) {
    throw new Error('CategoryRepository.findById() must be implemented');
  }

  async findAll() {
    throw new Error('CategoryRepository.findAll() must be implemented');
  }

  async update(id, categoryData) {
    throw new Error('CategoryRepository.update() must be implemented');
  }

  async delete(id) {
    throw new Error('CategoryRepository.delete() must be implemented');
  }
}

module.exports = CategoryRepository;
