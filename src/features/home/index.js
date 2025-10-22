// Dependency injection container for Home feature
const GetInitialDataUseCase = require('./application/useCases/GetInitialDataUseCase');
const HomeController = require('./presentation/controllers/HomeController');
const createHomeRoutes = require('./presentation/routes/homeRoutes');

// This will be injected from other features
const createHomeFeature = (categoryRepository, eventRepository, userRepository) => {
  // Initialize use cases
  const getInitialDataUseCase = new GetInitialDataUseCase(
    categoryRepository,
    eventRepository,
    userRepository
  );

  // Initialize controller
  const homeController = new HomeController(getInitialDataUseCase);

  return {
    homeController,
  };
};

module.exports = {
  createHomeFeature,
};
