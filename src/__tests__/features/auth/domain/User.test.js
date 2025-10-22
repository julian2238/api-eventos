const User = require('../../../../features/auth/domain/User');

describe('User Domain Entity', () => {
  describe('constructor', () => {
    it('should create a user with all required properties', () => {
      const userData = {
        uid: 'test-uid',
        document: '12345678',
        fullName: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        gender: 'M',
        birthDate: new Date('1990-01-01'),
        role: 'USUARIO',
      };

      const user = new User(userData);

      expect(user.uid).toBe(userData.uid);
      expect(user.document).toBe(userData.document);
      expect(user.fullName).toBe(userData.fullName);
      expect(user.email).toBe(userData.email);
      expect(user.phone).toBe(userData.phone);
      expect(user.gender).toBe(userData.gender);
      expect(user.birthDate).toBe(userData.birthDate);
      expect(user.role).toBe(userData.role);
    });

    it('should set default values for optional properties', () => {
      const userData = {
        uid: 'test-uid',
        document: '12345678',
        fullName: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        gender: 'M',
        birthDate: new Date('1990-01-01'),
      };

      const user = new User(userData);

      expect(user.role).toBe('USUARIO');
      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('business rules', () => {
    let user;

    beforeEach(() => {
      user = new User({
        uid: 'test-uid',
        document: '12345678',
        fullName: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        gender: 'M',
        birthDate: new Date('1990-01-01'),
        role: 'USUARIO',
      });
    });

    it('should return true for isAdmin when role is ADMIN', () => {
      user.role = 'ADMIN';
      expect(user.isAdmin()).toBe(true);
    });

    it('should return false for isAdmin when role is not ADMIN', () => {
      expect(user.isAdmin()).toBe(false);
    });

    it('should return true for isCoordinator when role is COORDINADOR', () => {
      user.role = 'COORDINADOR';
      expect(user.isCoordinator()).toBe(true);
    });

    it('should return false for isCoordinator when role is not COORDINADOR', () => {
      expect(user.isCoordinator()).toBe(false);
    });

    it('should return true for canAccessWeb when user is admin', () => {
      user.role = 'ADMIN';
      expect(user.canAccessWeb()).toBe(true);
    });

    it('should return true for canAccessWeb when user is coordinator', () => {
      user.role = 'COORDINADOR';
      expect(user.canAccessWeb()).toBe(true);
    });

    it('should return false for canAccessWeb when user is regular user', () => {
      expect(user.canAccessWeb()).toBe(false);
    });
  });

  describe('factory methods', () => {
    it('should create user from Firebase user data', () => {
      const firebaseUser = {
        uid: 'firebase-uid',
        email: 'firebase@example.com',
      };

      const additionalData = {
        document: '87654321',
        fullName: 'Firebase User',
        phone: '+0987654321',
        gender: 'F',
        birthDate: new Date('1985-05-15'),
        role: 'ADMIN',
      };

      const user = User.createFromFirebase(firebaseUser, additionalData);

      expect(user.uid).toBe(firebaseUser.uid);
      expect(user.email).toBe(firebaseUser.email);
      expect(user.document).toBe(additionalData.document);
      expect(user.fullName).toBe(additionalData.fullName);
      expect(user.phone).toBe(additionalData.phone);
      expect(user.gender).toBe(additionalData.gender);
      expect(user.birthDate).toBe(additionalData.birthDate);
      expect(user.role).toBe(additionalData.role);
    });
  });

  describe('toJSON', () => {
    it('should return user data as plain object', () => {
      const userData = {
        uid: 'test-uid',
        document: '12345678',
        fullName: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        gender: 'M',
        birthDate: new Date('1990-01-01'),
        role: 'USUARIO',
      };

      const user = new User(userData);
      const json = user.toJSON();

      expect(json).toEqual(expect.objectContaining({
        uid: userData.uid,
        document: userData.document,
        fullName: userData.fullName,
        email: userData.email,
        phone: userData.phone,
        gender: userData.gender,
        birthDate: userData.birthDate,
        role: userData.role,
      }));
    });
  });
});
