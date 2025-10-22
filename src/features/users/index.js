// Dependency injection container for Users feature
const FirebaseUserRepository = require('./infrastructure/repositories/FirebaseUserRepository');

const GetUsersUseCase = require('./application/useCases/GetUsersUseCase');
const GetUserByIdUseCase = require('./application/useCases/GetUserByIdUseCase');
const UpdateUserUseCase = require('./application/useCases/UpdateUserUseCase');
const DeleteUserUseCase = require('./application/useCases/DeleteUserUseCase');

const UserController = require('./presentation/controllers/UserController');
const createUserRoutes = require('./presentation/routes/userRoutes');

// Initialize dependencies
const userRepository = new FirebaseUserRepository();

// Initialize use cases
const getUsersUseCase = new GetUsersUseCase(userRepository);
const getUserByIdUseCase = new GetUserByIdUseCase(userRepository);
const updateUserUseCase = new UpdateUserUseCase(userRepository);
const deleteUserUseCase = new DeleteUserUseCase(userRepository);

// Initialize controller
const userController = new UserController(
  getUsersUseCase,
  getUserByIdUseCase,
  updateUserUseCase,
  deleteUserUseCase
);

module.exports = {
  userController,
  userRepository,
};
