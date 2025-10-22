const { NotFoundError, ValidationError } = require('../../../../shared/errors/AppError');

class DeleteCategoryUseCase {
  constructor(categoryRepository) {
    this.categoryRepository = categoryRepository;
  }

  async execute(categoryId) {
    try {
      // Validate input
      if (!categoryId) {
        throw new ValidationError('ID de categoría es requerido');
      }

      // Check if category exists
      const existingCategory = await this.categoryRepository.findById(categoryId);
      if (!existingCategory) {
        throw new NotFoundError('Categoría');
      }

      // Delete category
      await this.categoryRepository.delete(categoryId);
      
      return {
        message: 'Categoría eliminada correctamente',
        data: null,
      };
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof ValidationError) {
        throw error;
      }
      throw new Error('Error eliminando categoría: ' + error.message);
    }
  }
}

module.exports = DeleteCategoryUseCase;
