class TokenPair {
  constructor(accessToken, refreshToken, user) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.user = user;
  }

  toJSON() {
    return {
      token: this.accessToken,
      refreshToken: this.refreshToken,
      uid: this.user.uid,
      fullName: this.user.fullName,
      role: this.user.role,
    };
  }
}

module.exports = TokenPair;
