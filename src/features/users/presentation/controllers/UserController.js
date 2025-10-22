const { successResponse } = require('../../../../shared/middleware/responseHandler');
const asyncHandler = require('../../../../shared/middleware/asyncHandler');

class UserController {
  constructor(
    getUsersUseCase,
    getUserByIdUseCase,
    updateUserUseCase,
    deleteUserUseCase
  ) {
    this.getUsersUseCase = getUsersUseCase;
    this.getUserByIdUseCase = getUserByIdUseCase;
    this.updateUserUseCase = updateUserUseCase;
    this.deleteUserUseCase = deleteUserUseCase;
  }

  getUsers = asyncHandler(async (req, res) => {
    const result = await this.getUsersUseCase.execute();
    return successResponse(res, 200, result.message, result.data);
  });

  getUserById = asyncHandler(async (req, res) => {
    const result = await this.getUserByIdUseCase.execute(req.params.id);
    return successResponse(res, 200, result.message, result.data);
  });

  updateUser = asyncHandler(async (req, res) => {
    const result = await this.updateUserUseCase.execute(
      req.params.id,
      req.body,
      req.user.uid,
      req.user.role
    );
    return successResponse(res, 200, result.message, result.data);
  });

  deleteUser = asyncHandler(async (req, res) => {
    const result = await this.deleteUserUseCase.execute(
      req.params.id,
      req.user.uid,
      req.user.role
    );
    return successResponse(res, 200, result.message, result.data);
  });
}

module.exports = UserController;
