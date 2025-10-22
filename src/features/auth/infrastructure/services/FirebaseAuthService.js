const { auth } = require('../../../../shared/database/firebase');
const axios = require('axios');
const config = require('../../../../shared/config');

class FirebaseAuthService {
  async createUser(userData) {
    try {
      const firebaseUser = await auth.createUser({
        email: userData.email,
        password: userData.password,
        displayName: userData.fullName,
        phoneNumber: userData.phone,
        disabled: false,
        emailVerified: false,
        uid: userData.document,
      });

      return firebaseUser;
    } catch (error) {
      throw new Error(`Error creating Firebase user: ${error.message}`);
    }
  }

  async login(email, password, platform) {
    const URL = `${config.firebaseAuth.signInUrl}${config.firebaseAuth.apiKey}`;
    
    try {
      const response = await axios.post(URL, {
        email,
        password,
        returnSecureToken: true,
      });

      const { localId: uid } = response.data;
      return { uid };
    } catch (error) {
      const firebaseError = error.response?.data?.error;
      const message = firebaseError?.message || 'Error desconocido de autenticación';
      throw new Error(message);
    }
  }
}

module.exports = FirebaseAuthService;
