const { ConflictError, ValidationError } = require('../../../../shared/errors/AppError');
const User = require('../../domain/User');

class SignUpUseCase {
  constructor(userRepository, authService) {
    this.userRepository = userRepository;
    this.authService = authService;
  }

  async execute(userData) {
    // Check if user already exists
    const existingUser = await this.userRepository.findByDocument(userData.document);
    if (existingUser) {
      throw new ConflictError('Ya existe un usuario con ese documento');
    }

    // Check if email is already taken
    const existingEmail = await this.userRepository.findByEmail(userData.email);
    if (existingEmail) {
      throw new ConflictError('Ya existe un usuario con ese email');
    }

    try {
      // Create Firebase user
      const firebaseUser = await this.authService.createUser(userData);
      
      // Save user to database using insertUser method
      await this.userRepository.insertUser(firebaseUser.uid, userData);
      
      return {
        message: 'Usuario creado correctamente',
        uid: firebaseUser.uid,
      };
    } catch (error) {
      throw new ValidationError('No se pudo crear el usuario: ' + error.message);
    }
  }
}

module.exports = SignUpUseCase;
