const admin = require('firebase-admin');
const { initializeApp, applicationDefault } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// Initialize Firebase Admin SDK using application default credentials
if (!admin.apps.length) {
  initializeApp({
    credential: applicationDefault(),
  });
}

const db = getFirestore();
const auth = admin.auth();

module.exports = {
  admin,
  db,
  auth,
};
