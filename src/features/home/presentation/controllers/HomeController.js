const { successResponse } = require('../../../../shared/middleware/responseHandler');
const asyncHandler = require('../../../../shared/middleware/asyncHandler');

class HomeController {
  constructor(getInitialDataUseCase) {
    this.getInitialDataUseCase = getInitialDataUseCase;
  }

  getInitialData = asyncHandler(async (req, res) => {
    const result = await this.getInitialDataUseCase.execute(req.user.uid, req.user.role);
    return successResponse(res, 200, result.message, result.data);
  });
}

module.exports = HomeController;
