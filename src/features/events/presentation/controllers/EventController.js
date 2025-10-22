const { successResponse } = require('../../../../shared/middleware/responseHandler');
const asyncHandler = require('../../../../shared/middleware/asyncHandler');

class EventController {
  constructor(
    createEventUseCase,
    getEventsUseCase,
    getEventByIdUseCase,
    updateEventUseCase,
    deleteEventUseCase,
    participateInEventUseCase,
    leaveEventUseCase,
    addFavoriteUseCase,
    removeFavoriteUseCase
  ) {
    this.createEventUseCase = createEventUseCase;
    this.getEventsUseCase = getEventsUseCase;
    this.getEventByIdUseCase = getEventByIdUseCase;
    this.updateEventUseCase = updateEventUseCase;
    this.deleteEventUseCase = deleteEventUseCase;
    this.participateInEventUseCase = participateInEventUseCase;
    this.leaveEventUseCase = leaveEventUseCase;
    this.addFavoriteUseCase = addFavoriteUseCase;
    this.removeFavoriteUseCase = removeFavoriteUseCase;
  }

  createEvent = asyncHandler(async (req, res) => {
    const result = await this.createEventUseCase.execute(req.body, req.user.uid);
    return successResponse(res, 201, result.message, result.data);
  });

  getEvents = asyncHandler(async (req, res) => {
    const result = await this.getEventsUseCase.execute(req.query);
    return successResponse(res, 200, result.message, result.data);
  });

  getEventById = asyncHandler(async (req, res) => {
    const result = await this.getEventByIdUseCase.execute(req.params.id);
    return successResponse(res, 200, result.message, result.data);
  });

  updateEvent = asyncHandler(async (req, res) => {
    const result = await this.updateEventUseCase.execute(req.params.id, req.body, req.user.uid);
    return successResponse(res, 200, result.message);
  });

  deleteEvent = asyncHandler(async (req, res) => {
    const result = await this.deleteEventUseCase.execute(req.params.id, req.user.uid);
    return successResponse(res, 200, result.message);
  });

  participateInEvent = asyncHandler(async (req, res) => {
    const result = await this.participateInEventUseCase.execute(req.params.id, req.user.uid);
    return successResponse(res, 200, result.message);
  });

  leaveEvent = asyncHandler(async (req, res) => {
    const result = await this.leaveEventUseCase.execute(req.params.id, req.user.uid);
    return successResponse(res, 200, result.message);
  });

  addFavorite = asyncHandler(async (req, res) => {
    const result = await this.addFavoriteUseCase.execute(req.params.id, req.user.uid);
    return successResponse(res, 200, result.message);
  });

  removeFavorite = asyncHandler(async (req, res) => {
    const result = await this.removeFavoriteUseCase.execute(req.params.id, req.user.uid);
    return successResponse(res, 200, result.message);
  });
}

module.exports = EventController;
