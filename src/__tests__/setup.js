// Test setup file
require('dotenv').config({ path: '.env.test' });

// Mock Firebase Admin SDK for tests
jest.mock('../shared/database/firebase', () => ({
  admin: {
    auth: jest.fn(() => ({
      createUser: jest.fn(),
    })),
    firestore: {
      FieldValue: {
        serverTimestamp: jest.fn(() => 'mock-timestamp'),
        increment: jest.fn((value) => ({ increment: value })),
      },
      Timestamp: {
        fromDate: jest.fn((date) => ({ toDate: () => date })),
        now: jest.fn(() => ({ toDate: () => new Date() })),
      },
    },
  },
  db: {
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        get: jest.fn(),
        set: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        collection: jest.fn(() => ({
          doc: jest.fn(() => ({
            get: jest.fn(),
            set: jest.fn(),
            delete: jest.fn(),
          })),
        })),
      })),
      add: jest.fn(),
      get: jest.fn(),
      where: jest.fn(() => ({
        limit: jest.fn(() => ({
          get: jest.fn(),
        })),
        orderBy: jest.fn(() => ({
          limit: jest.fn(() => ({
            get: jest.fn(),
          })),
        })),
      })),
    })),
  },
  auth: {
    createUser: jest.fn(),
  },
}));

// Global test utilities
global.testUtils = {
  createMockUser: (overrides = {}) => ({
    uid: 'test-uid',
    document: '12345678',
    fullName: 'Test User',
    email: 'test@example.com',
    phone: '+1234567890',
    gender: 'M',
    birthDate: new Date('1990-01-01'),
    role: 'USUARIO',
    ...overrides,
  }),
  
  createMockEvent: (overrides = {}) => ({
    id: 'test-event-id',
    title: 'Test Event',
    description: 'Test event description',
    category: 'test-category',
    date: '2024-12-31',
    hour: '10:00',
    routes: [],
    createdBy: 'test-uid',
    participantsCount: 0,
    favoritesCount: 0,
    status: 'active',
    ...overrides,
  }),
};
