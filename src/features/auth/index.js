// Dependency injection container for Auth feature
const FirebaseUserRepository = require('./infrastructure/repositories/FirebaseUserRepository');
const FirebaseTokenRepository = require('./infrastructure/repositories/FirebaseTokenRepository');
const FirebaseAuthService = require('./infrastructure/services/FirebaseAuthService');
const JwtService = require('./infrastructure/services/JwtService');

const SignUpUseCase = require('./application/useCases/SignUpUseCase');
const SignInUseCase = require('./application/useCases/SignInUseCase');
const RefreshTokenUseCase = require('./application/useCases/RefreshTokenUseCase');

const AuthController = require('./presentation/controllers/AuthController');
const AuthMiddleware = require('./presentation/middleware/authMiddleware');
const createAuthRoutes = require('./presentation/routes/authRoutes');

// Initialize dependencies
const userRepository = new FirebaseUserRepository();
const tokenRepository = new FirebaseTokenRepository();
const authService = new FirebaseAuthService();
const jwtService = new JwtService();

// Initialize use cases
const signUpUseCase = new SignUpUseCase(userRepository, authService);
const signInUseCase = new SignInUseCase(userRepository, authService, tokenRepository, jwtService);
const refreshTokenUseCase = new RefreshTokenUseCase(tokenRepository, jwtService);

// Initialize controllers and middleware
const authController = new AuthController(signUpUseCase, signInUseCase, refreshTokenUseCase);
const authMiddleware = new AuthMiddleware(jwtService);

// Create routes
const authRoutes = createAuthRoutes(authController, authMiddleware);

module.exports = {
  authRoutes,
  authMiddleware,
  jwtService,
};
