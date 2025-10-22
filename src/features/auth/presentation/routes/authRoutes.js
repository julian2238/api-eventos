const { Router } = require('express');
const { validateRequest } = require('../../../../shared/middleware/validation');
const asyncHandler = require('../../../../shared/middleware/asyncHandler');

const createAuthRoutes = (authController, authMiddleware) => {
  const router = Router();

  // Public routes
  router.post('/signup', 
    validateRequest('user', 'create'),
    authController.signUp
  );

  router.post('/signin', 
    validateRequest('user', 'login'),
    authController.signIn
  );

  router.post('/refreshToken', 
    validateRequest('user', 'refreshToken'),
    authController.refreshToken
  );

  // Protected routes (example)
  router.get('/profile', 
    asyncHandler(authMiddleware.authenticate),
    (req, res) => {
      res.json({
        status: true,
        message: 'Profile data',
        data: req.user
      });
    }
  );

  return router;
};

module.exports = createAuthRoutes;
