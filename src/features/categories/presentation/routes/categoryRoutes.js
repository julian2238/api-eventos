const { Router } = require('express');
const { validateRequest } = require('../../../../shared/middleware/validation');
const asyncHandler = require('../../../../shared/middleware/asyncHandler');

const createCategoryRoutes = (categoryController, authMiddleware) => {
  const router = Router();

  // Protected routes
  router.get('/',
    asyncHandler(authMiddleware.authenticate),
    categoryController.getCategories
  );

  // Protected routes (admin only)
  router.post('/',
    asyncHandler(authMiddleware.authenticate),
    asyncHandler(authMiddleware.authorize(['ADMIN'])),
    validateRequest('category', 'create'),
    categoryController.createCategory
  );

  router.put('/:id',
    asyncHandler(authMiddleware.authenticate),
    asyncHandler(authMiddleware.authorize(['ADMIN'])),
    validateRequest('category', 'create'),
    categoryController.updateCategory
  );

  router.delete('/:id',
    asyncHandler(authMiddleware.authenticate),
    asyncHandler(authMiddleware.authorize(['ADMIN'])),
    categoryController.deleteCategory
  );

  return router;
};

module.exports = createCategoryRoutes;
