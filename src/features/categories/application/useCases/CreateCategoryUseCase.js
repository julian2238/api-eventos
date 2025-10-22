const { ValidationError, ConflictError } = require('../../../../shared/errors/AppError');
const Category = require('../../domain/Category');

class CreateCategoryUseCase {
  constructor(categoryRepository) {
    this.categoryRepository = categoryRepository;
  }

  async execute(categoryData) {
    try {
      // Create domain category
      const category = Category.createFromRequest(categoryData);
      
      // Validate category
      if (!category.isValid()) {
        throw new ValidationError('Nombre de categoría inválido');
      }

      // Check if category already exists
      const existingCategories = await this.categoryRepository.findAll();
      const categoryExists = existingCategories.some(
        cat => cat.name.toLowerCase() === category.name.toLowerCase()
      );
      
      if (categoryExists) {
        throw new ConflictError('Ya existe una categoría con ese nombre');
      }
      
      // Save to repository
      const createdCategory = await this.categoryRepository.create(category);
      
      return {
        message: 'Categoría creada correctamente',
        data: createdCategory.toJSON(),
      };
    } catch (error) {
      if (error instanceof ValidationError || error instanceof ConflictError) {
        throw error;
      }
      throw new ValidationError('No se pudo crear la categoría: ' + error.message);
    }
  }
}

module.exports = CreateCategoryUseCase;
