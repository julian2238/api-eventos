const { AuthenticationError } = require('../../../../shared/errors/AppError');
const JwtService = require('../../infrastructure/services/JwtService');

class AuthMiddleware {
  constructor(jwtService) {
    this.jwtService = jwtService;
  }

  authenticate = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
      throw new AuthenticationError('No se ha proporcionado un token de autenticación');
    }

    try {
      const decoded = this.jwtService.verifyToken(token);
      req.user = decoded;
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new AuthenticationError('Token expirado');
      }
      throw new AuthenticationError('Token inválido');
    }
  };

  authorize = (allowedRoles = []) => {
    return (req, res, next) => {
      if (!req.user) {
        throw new AuthenticationError('Usuario no autenticado');
      }

      if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.role)) {
        throw new AuthenticationError('No autorizado');
      }

      next();
    };
  };
}

module.exports = AuthMiddleware;
