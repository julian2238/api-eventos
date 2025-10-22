const { NotFoundError, AuthorizationError } = require('../../../../shared/errors/AppError');

class DeleteUserUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(userId, requesterId, requesterRole) {
    try {
      // Check if user exists
      const existingUser = await this.userRepository.findByUid(userId);
      if (!existingUser) {
        throw new NotFoundError('Usuario');
      }

      // Check if requester can delete this user
      if (requesterId === userId) {
        throw new AuthorizationError('No puedes eliminar tu propia cuenta');
      }

      if (!['ADMIN'].includes(requesterRole)) {
        throw new AuthorizationError('Solo los administradores pueden eliminar usuarios');
      }

      // Delete user
      await this.userRepository.delete(userId);
      
      return {
        message: 'Usuario eliminado correctamente',
        data: null,
      };
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof AuthorizationError) {
        throw error;
      }
      throw new Error('Error eliminando usuario: ' + error.message);
    }
  }
}

module.exports = DeleteUserUseCase;
