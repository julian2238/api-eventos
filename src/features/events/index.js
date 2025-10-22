// Dependency injection container for Events feature
const FirebaseEventRepository = require('./infrastructure/repositories/FirebaseEventRepository');

const CreateEventUseCase = require('./application/useCases/CreateEventUseCase');
const GetEventsUseCase = require('./application/useCases/GetEventsUseCase');
const GetEventByIdUseCase = require('./application/useCases/GetEventByIdUseCase');
const UpdateEventUseCase = require('./application/useCases/UpdateEventUseCase');
const DeleteEventUseCase = require('./application/useCases/DeleteEventUseCase');
const ParticipateInEventUseCase = require('./application/useCases/ParticipateInEventUseCase');
const LeaveEventUseCase = require('./application/useCases/LeaveEventUseCase');
const AddFavoriteUseCase = require('./application/useCases/AddFavoriteUseCase');
const RemoveFavoriteUseCase = require('./application/useCases/RemoveFavoriteUseCase');

const EventController = require('./presentation/controllers/EventController');
const createEventRoutes = require('./presentation/routes/eventRoutes');

// Initialize dependencies
const eventRepository = new FirebaseEventRepository();

// Initialize use cases
const createEventUseCase = new CreateEventUseCase(eventRepository);
const getEventsUseCase = new GetEventsUseCase(eventRepository);
const getEventByIdUseCase = new GetEventByIdUseCase(eventRepository);
const updateEventUseCase = new UpdateEventUseCase(eventRepository);
const deleteEventUseCase = new DeleteEventUseCase(eventRepository);
const participateInEventUseCase = new ParticipateInEventUseCase(eventRepository);
const leaveEventUseCase = new LeaveEventUseCase(eventRepository);
const addFavoriteUseCase = new AddFavoriteUseCase(eventRepository);
const removeFavoriteUseCase = new RemoveFavoriteUseCase(eventRepository);

// Initialize controller
const eventController = new EventController(
  createEventUseCase,
  getEventsUseCase,
  getEventByIdUseCase,
  updateEventUseCase,
  deleteEventUseCase,
  participateInEventUseCase,
  leaveEventUseCase,
  addFavoriteUseCase,
  removeFavoriteUseCase
);

module.exports = {
  eventController,
  eventRepository,
};
