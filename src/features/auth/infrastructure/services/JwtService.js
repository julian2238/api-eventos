const jwt = require('jsonwebtoken');
const config = require('../../../../shared/config');

class JwtService {
  generateAccessToken(uid, role, platform) {
    return jwt.sign(
      { uid, role, platform },
      process.env.JWT_SECRET || config.jwt.accessTokenSecret,
      { expiresIn: '1h' }
    );
  }

  generateRefreshToken(uid, role, platform) {
    return jwt.sign(
      { uid, role, platform },
      process.env.JWT_SECRET || config.jwt.refreshTokenSecret,
      { expiresIn: '7d' }
    );
  }

  verifyAccessToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET || config.jwt.accessTokenSecret);
  }

  verifyRefreshToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET || config.jwt.refreshTokenSecret);
  }

  verifyToken(token) {
    try {
      return this.verifyAccessToken(token);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw error;
      }
      throw new Error('Invalid token');
    }
  }
}

module.exports = JwtService;
