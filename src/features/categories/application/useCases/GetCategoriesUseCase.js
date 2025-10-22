const { NotFoundError } = require('../../../../shared/errors/AppError');

class GetCategoriesUseCase {
  constructor(categoryRepository) {
    this.categoryRepository = categoryRepository;
  }

  async execute() {
    try {
      const categories = await this.categoryRepository.findAll();
      
      if (categories.length === 0) {
        return {
          message: 'No hay categorías registradas',
          data: [],
        };
      }

      return {
        message: 'Categorías obtenidas correctamente',
        data: categories.map(category => category.toJSON()),
      };
    } catch (error) {
      throw new Error('Error obteniendo categorías: ' + error.message);
    }
  }
}

module.exports = GetCategoriesUseCase;
