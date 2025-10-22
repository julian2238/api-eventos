const { NotFoundError } = require('../../../../shared/errors/AppError');

class GetUsersUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute() {
    try {
      const users = await this.userRepository.findAll();
      
      if (users.length === 0) {
        return {
          message: 'No hay usuarios registrados',
          data: [],
        };
      }

      return {
        message: 'Usuarios obtenidos correctamente',
        data: users.map(user => user.toPublicJSON()),
      };
    } catch (error) {
      throw new Error('Error obteniendo usuarios: ' + error.message);
    }
  }
}

module.exports = GetUsersUseCase;
