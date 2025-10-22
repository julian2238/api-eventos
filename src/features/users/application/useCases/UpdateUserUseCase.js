const { NotFoundError, AuthorizationError } = require('../../../../shared/errors/AppError');

class UpdateUserUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(userId, userData, requesterId, requesterRole) {
    try {
      // Check if user exists
      const existingUser = await this.userRepository.findByUid(userId);
      if (!existingUser) {
        throw new NotFoundError('Usuario');
      }

      // Check if requester can update this user
      if (requesterId !== userId && !['ADMIN', 'COORDINADOR'].includes(requesterRole)) {
        throw new AuthorizationError('No tienes permisos para actualizar este usuario');
      }

      // Remove sensitive fields that shouldn't be updated
      const { password, role, ...safeUserData } = userData;
      
      // Only admins can update roles
      if (role && requesterRole !== 'ADMIN') {
        throw new AuthorizationError('Solo los administradores pueden cambiar roles');
      }

      const updateData = role ? { ...safeUserData, role } : safeUserData;

      // Update user
      const updatedUser = await this.userRepository.update(userId, updateData);
      
      return {
        message: 'Usuario actualizado correctamente',
        data: updatedUser.toPublicJSON(),
      };
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof AuthorizationError) {
        throw error;
      }
      throw new Error('Error actualizando usuario: ' + error.message);
    }
  }
}

module.exports = UpdateUserUseCase;
