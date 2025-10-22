const { Router } = require('express');
const { validateRequest } = require('../../../../shared/middleware/validation');
const asyncHandler = require('../../../../shared/middleware/asyncHandler');

const createEventRoutes = (eventController, authMiddleware) => {
  const router = Router();

  // Protected routes (all require authentication)
  router.get('/',
    asyncHandler(authMiddleware.authenticate),
    eventController.getEvents
  );

  router.get('/:id',
    asyncHandler(authMiddleware.authenticate),
    eventController.getEventById
  );

  router.post('/',
    asyncHandler(authMiddleware.authenticate),
    asyncHandler(authMiddleware.authorize(['ADMIN', 'COORDINADOR'])),
    validateRequest('event', 'create'),
    eventController.createEvent
  );

  router.put('/:id',
    asyncHandler(authMiddleware.authenticate),
    asyncHandler(authMiddleware.authorize(['ADMIN', 'COORDINADOR'])),
    validateRequest('event', 'update'),
    eventController.updateEvent
  );

  router.delete('/:id',
    asyncHandler(authMiddleware.authenticate),
    asyncHandler(authMiddleware.authorize(['ADMIN', 'COORDINADOR'])),
    eventController.deleteEvent
  );

  router.post('/participar/:id',
    asyncHandler(authMiddleware.authenticate),
    eventController.participateInEvent
  );

  router.delete('/participar/:id',
    asyncHandler(authMiddleware.authenticate),
    eventController.leaveEvent
  );

  router.post('/favorito/:id',
    asyncHandler(authMiddleware.authenticate),
    eventController.addFavorite
  );

  router.delete('/favorito/:id',
    asyncHandler(authMiddleware.authenticate),
    eventController.removeFavorite
  );

  return router;
};

module.exports = createEventRoutes;
