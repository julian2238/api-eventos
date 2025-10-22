class AuthService {
  async createUser(userData) {
    throw new Error('AuthService.createUser() must be implemented');
  }

  async login(email, password, platform) {
    throw new Error('AuthService.login() must be implemented');
  }

  async validateRefreshToken(refreshToken) {
    throw new Error('AuthService.validateRefreshToken() must be implemented');
  }
}

module.exports = AuthService;
