const { NotFoundError, ValidationError } = require('../../../../shared/errors/AppError');

class UpdateCategoryUseCase {
  constructor(categoryRepository) {
    this.categoryRepository = categoryRepository;
  }

  async execute(categoryId, categoryData) {
    try {
      // Validate input
      if (!categoryId) {
        throw new ValidationError('ID de categoría es requerido');
      }

      if (!categoryData || Object.keys(categoryData).length === 0) {
        throw new ValidationError('Datos de categoría son requeridos');
      }

      // Check if category exists
      const existingCategory = await this.categoryRepository.findById(categoryId);
      if (!existingCategory) {
        throw new NotFoundError('Categoría');
      }

      // Update category
      const updatedCategory = await this.categoryRepository.update(categoryId, categoryData);
      
      return {
        message: 'Categoría actualizada correctamente',
        data: updatedCategory.toJSON(),
      };
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof ValidationError) {
        throw error;
      }
      throw new Error('Error actualizando categoría: ' + error.message);
    }
  }
}

module.exports = UpdateCategoryUseCase;
