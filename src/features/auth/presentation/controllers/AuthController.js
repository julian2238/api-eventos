const SignUpUseCase = require('../../application/useCases/SignUpUseCase');
const SignInUseCase = require('../../application/useCases/SignInUseCase');
const RefreshTokenUseCase = require('../../application/useCases/RefreshTokenUseCase');
const { successResponse } = require('../../../../shared/middleware/responseHandler');
const asyncHandler = require('../../../../shared/middleware/asyncHandler');

class AuthController {
  constructor(signUpUseCase, signInUseCase, refreshTokenUseCase) {
    this.signUpUseCase = signUpUseCase;
    this.signInUseCase = signInUseCase;
    this.refreshTokenUseCase = refreshTokenUseCase;
  }

  signUp = asyncHandler(async (req, res) => {
    const result = await this.signUpUseCase.execute(req.body);
    return successResponse(res, 201, result.message, { uid: result.uid });
  });

  signIn = asyncHandler(async (req, res) => {
    const { email, password, platform } = req.body;
    const result = await this.signInUseCase.execute(email, password, platform);
    return successResponse(res, 200, result.message, result.data);
  });

  refreshToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;
    const result = await this.refreshTokenUseCase.execute(refreshToken);
    return successResponse(res, 200, result.message, result.data);
  });
}

module.exports = AuthController;
