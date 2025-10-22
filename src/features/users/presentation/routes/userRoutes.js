const { Router } = require('express');
const { validateRequest } = require('../../../../shared/middleware/validation');
const asyncHandler = require('../../../../shared/middleware/asyncHandler');

const createUserRoutes = (userController, authMiddleware) => {
  const router = Router();

  // Protected routes
  router.get('/',
    asyncHandler(authMiddleware.authenticate),
    userController.getUsers
  );

  router.get('/:id',
    asyncHandler(authMiddleware.authenticate),
    userController.getUserById
  );

  router.put('/:id',
    asyncHandler(authMiddleware.authenticate),
    asyncHandler(authMiddleware.authorize(['ADMIN', 'COORDINADOR'])),
    validateRequest('userUpdate', 'update'),
    userController.updateUser
  );

  return router;
};

module.exports = createUserRoutes;
