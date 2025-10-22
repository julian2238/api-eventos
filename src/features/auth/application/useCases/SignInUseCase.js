const { AuthenticationError, AuthorizationError, NotFoundError } = require('../../../../shared/errors/AppError');
const TokenPair = require('../../domain/TokenPair');

class SignInUseCase {
  constructor(userRepository, authService, tokenRepository, jwtService) {
    this.userRepository = userRepository;
    this.authService = authService;
    this.tokenRepository = tokenRepository;
    this.jwtService = jwtService;
  }

  async execute(email, password, platform) {
    try {
      // Authenticate with Firebase
      const firebaseUser = await this.authService.login(email, password, platform);
      
      // Get user from database
      const user = await this.userRepository.findByUid(firebaseUser.uid);
      if (!user) {
        throw new NotFoundError('Usuario');
      }

      // Check platform authorization
      if (platform === 'web' && !user.canAccessWeb()) {
        throw new AuthorizationError('No autorizado para acceder desde web');
      }

      // Generate tokens
      const accessToken = this.jwtService.generateAccessToken(user.uid, user.role, platform);
      const refreshToken = this.jwtService.generateRefreshToken(user.uid, user.role, platform);

      // Save refresh token
      await this.tokenRepository.saveRefreshToken(user.uid, refreshToken, platform);

      // Create token pair
      const tokenPair = new TokenPair(accessToken, refreshToken, user);

      return {
        message: 'Usuario autenticado correctamente',
        data: tokenPair.toJSON(),
      };
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof AuthorizationError) {
        throw error;
      }
      throw new AuthenticationError(error.message);
    }
  }
}

module.exports = SignInUseCase;
