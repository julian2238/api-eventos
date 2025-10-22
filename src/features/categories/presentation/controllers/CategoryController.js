const { successResponse } = require('../../../../shared/middleware/responseHandler');
const asyncHandler = require('../../../../shared/middleware/asyncHandler');

class CategoryController {
  constructor(
    getCategoriesUseCase,
    createCategoryUseCase,
    updateCategoryUseCase,
    deleteCategoryUseCase
  ) {
    this.getCategoriesUseCase = getCategoriesUseCase;
    this.createCategoryUseCase = createCategoryUseCase;
    this.updateCategoryUseCase = updateCategoryUseCase;
    this.deleteCategoryUseCase = deleteCategoryUseCase;
  }

  getCategories = asyncHandler(async (req, res) => {
    const result = await this.getCategoriesUseCase.execute();
    return successResponse(res, 200, result.message, result.data);
  });

  createCategory = asyncHandler(async (req, res) => {
    const result = await this.createCategoryUseCase.execute(req.body);
    return successResponse(res, 201, result.message, result.data);
  });

  updateCategory = asyncHandler(async (req, res) => {
    const result = await this.updateCategoryUseCase.execute(req.params.id, req.body);
    return successResponse(res, 200, result.message, result.data);
  });

  deleteCategory = asyncHandler(async (req, res) => {
    const result = await this.deleteCategoryUseCase.execute(req.params.id);
    return successResponse(res, 200, result.message, result.data);
  });
}

module.exports = CategoryController;
