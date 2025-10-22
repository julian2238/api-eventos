const { NotFoundError } = require('../../../../shared/errors/AppError');

class GetUserByIdUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(userId) {
    try {
      const user = await this.userRepository.findByUid(userId);
      
      if (!user) {
        throw new NotFoundError('Usuario');
      }

      return {
        message: 'Usuario obtenido correctamente',
        data: user.toPublicJSON(),
      };
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new Error('Error obteniendo usuario: ' + error.message);
    }
  }
}

module.exports = GetUserByIdUseCase;
