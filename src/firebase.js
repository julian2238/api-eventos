require('dotenv').config();
const admin = require('firebase-admin');
const { initializeApp, applicationDefault} = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

initializeApp({
    credential: applicationDefault(),
})

const db = getFirestore();

module.exports = {
    db,
    admin
}