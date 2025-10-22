const { Router } = require('express');
const asyncHandler = require('../../../../shared/middleware/asyncHandler');

const createHomeRoutes = (homeController, authMiddleware) => {
  const router = Router();

  // Protected routes
  router.get('/',
    asyncHandler(authMiddleware.authenticate),
    homeController.getInitialData
  );

  return router;
};

module.exports = createHomeRoutes;
