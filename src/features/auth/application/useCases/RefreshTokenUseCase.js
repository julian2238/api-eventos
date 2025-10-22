const { AuthenticationError } = require('../../../../shared/errors/AppError');
const TokenPair = require('../../domain/TokenPair');

class RefreshTokenUseCase {
  constructor(tokenRepository, jwtService) {
    this.tokenRepository = tokenRepository;
    this.jwtService = jwtService;
  }

  async execute(refreshToken) {
    try {
      // Verify refresh token
      const decoded = this.jwtService.verifyRefreshToken(refreshToken);
      const { uid, role, platform } = decoded;

      // Verify token exists in database
      const isValid = await this.tokenRepository.verifyRefreshToken(uid, refreshToken, platform);
      if (!isValid) {
        throw new AuthenticationError('Invalid refresh token');
      }

      // Generate new tokens
      const newAccessToken = this.jwtService.generateAccessToken(uid, role, platform);
      const newRefreshToken = this.jwtService.generateRefreshToken(uid, role, platform);

      // Save new refresh token
      await this.tokenRepository.saveRefreshToken(uid, newRefreshToken, platform);

      return {
        message: 'Tokens actualizados correctamente',
        data: {
          token: newAccessToken,
          refreshToken: newRefreshToken,
        },
      };
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new AuthenticationError('Refresh token expired');
      }
      throw new AuthenticationError('Invalid refresh token');
    }
  }
}

module.exports = RefreshTokenUseCase;
