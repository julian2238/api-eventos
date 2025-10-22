// Dependency injection container for Categories feature
const FirebaseCategoryRepository = require('./infrastructure/repositories/FirebaseCategoryRepository');

const GetCategoriesUseCase = require('./application/useCases/GetCategoriesUseCase');
const CreateCategoryUseCase = require('./application/useCases/CreateCategoryUseCase');

const CategoryController = require('./presentation/controllers/CategoryController');
const createCategoryRoutes = require('./presentation/routes/categoryRoutes');

// Initialize dependencies
const categoryRepository = new FirebaseCategoryRepository();

// Initialize use cases
const getCategoriesUseCase = new GetCategoriesUseCase(categoryRepository);
const createCategoryUseCase = new CreateCategoryUseCase(categoryRepository);

// Initialize controller
const categoryController = new CategoryController(
  getCategoriesUseCase,
  createCategoryUseCase
);

module.exports = {
  categoryController,
  categoryRepository,
};
