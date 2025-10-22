const { db } = require('../../../../shared/database/firebase');
const User = require('../../domain/User');

class FirebaseUserRepository {
  async create(user) {
    const userData = {
      document: user.document,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      gender: user.gender,
      birthDate: user.birthDate,
      role: user.role,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection('users').doc(user.uid).set(userData);
    return user;
  }

  async findByUid(uid) {
    const userDoc = await db.collection('users').doc(uid).get();
    
    if (!userDoc.exists) {
      return null;
    }

    return User.createFromDatabase(userDoc);
  }

  async findByDocument(document) {
    const usersSnapshot = await db.collection('users')
      .where('document', '==', document)
      .limit(1)
      .get();

    if (usersSnapshot.empty) {
      return null;
    }

    const userDoc = usersSnapshot.docs[0];
    return User.createFromDatabase(userDoc);
  }

  async findByEmail(email) {
    const usersSnapshot = await db.collection('users')
      .where('email', '==', email)
      .limit(1)
      .get();

    if (usersSnapshot.empty) {
      return null;
    }

    const userDoc = usersSnapshot.docs[0];
    return User.createFromDatabase(userDoc);
  }

  async findAll() {
    const usersSnapshot = await db.collection('users').get();
    
    if (usersSnapshot.empty) {
      return [];
    }

    return usersSnapshot.docs.map(doc => User.createFromDatabase(doc));
  }

  async update(uid, userData) {
    const updateData = {
      ...userData,
      updatedAt: new Date(),
    };

    await db.collection('users').doc(uid).update(updateData);
    
    return this.findByUid(uid);
  }

  async delete(uid) {
    await db.collection('users').doc(uid).delete();
    return true;
  }

  async insertUser(uid, userData) {
    delete userData.password;

    const userDataToSave = {
      ...userData,
      role: 'USUARIO',
      dtCreation: new Date(),
    };

    await db.collection('users').doc(uid).set(userDataToSave);
    return true;
  }

  async verifyUser(document) {
    const user = await db.collection('users').doc(document).get();
    return user.exists;
  }
}

module.exports = FirebaseUserRepository;
