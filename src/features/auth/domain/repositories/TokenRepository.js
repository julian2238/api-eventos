class TokenRepository {
  async saveRefreshToken(uid, refreshToken, platform) {
    throw new Error('TokenRepository.saveRefreshToken() must be implemented');
  }

  async verifyRefreshToken(uid, refreshToken, platform) {
    throw new Error('TokenRepository.verifyRefreshToken() must be implemented');
  }

  async revokeRefreshToken(uid, platform) {
    throw new Error('TokenRepository.revokeRefreshToken() must be implemented');
  }
}

module.exports = TokenRepository;
