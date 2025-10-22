const { successResponse } = require('../../../../shared/middleware/responseHandler');
const asyncHandler = require('../../../../shared/middleware/asyncHandler');

class CategoryController {
  constructor(
    getCategoriesUseCase,
    createCategoryUseCase
  ) {
    this.getCategoriesUseCase = getCategoriesUseCase;
    this.createCategoryUseCase = createCategoryUseCase;
  }

  getCategories = asyncHandler(async (req, res) => {
    const result = await this.getCategoriesUseCase.execute();
    return successResponse(res, 200, result.message, result.data);
  });

  createCategory = asyncHandler(async (req, res) => {
    const result = await this.createCategoryUseCase.execute(req.body);
    return successResponse(res, 201, result.message, result.data);
  });
}

module.exports = CategoryController;
