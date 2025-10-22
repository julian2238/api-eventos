const { db, admin } = require('../../../../shared/database/firebase');
const Event = require('../../domain/Event');

class FirebaseEventRepository {
  async create(event) {
    const eventDate = new Date(`${event.date}T${event.hour}:00`);
    
    const eventData = {
      title: event.title,
      description: event.description,
      category: event.category,
      date: admin.firestore.Timestamp.fromDate(eventDate),
      dtCreation: admin.firestore.FieldValue.serverTimestamp(),
      createdBy: event.createdBy,
      participantsCount: 0,
      favoritesCount: 0,
      status: 'active',
      routes: event.routes || [],
    };

    const eventRef = await db.collection('events').add(eventData);
    
    return new Event({
      id: eventRef.id,
      ...eventData,
      date: event.date,
      hour: event.hour,
    });
  }

  async findById(id) {
    const eventDoc = await db.collection('events').doc(id).get();
    
    if (!eventDoc.exists) {
      return null;
    }

    return Event.createFromDatabase(eventDoc);
  }

  async findAll(filters = {}) {
    let query = db.collection('events');
    
    if (filters.status) {
      query = query.where('status', '==', filters.status);
    }
    
    if (filters.category) {
      query = query.where('category', '==', filters.category);
    }
    
    const querySnapshot = await query.get();
    
    if (querySnapshot.empty) {
      return [];
    }

    return querySnapshot.docs.map(doc => Event.createFromDatabase(doc));
  }

  async update(id, eventData) {
    const eventRef = db.collection('events').doc(id);
    const eventSnap = await eventRef.get();

    if (!eventSnap.exists) {
      throw new Error('Evento no encontrado');
    }

    const updateData = {};
    
    if (eventData.title) updateData.title = eventData.title;
    if (eventData.description) updateData.description = eventData.description;
    if (eventData.category) updateData.category = eventData.category;
    if (eventData.routes) updateData.routes = eventData.routes;
    
    if (eventData.date && eventData.hour) {
      const eventDate = new Date(`${eventData.date}T${eventData.hour}:00`);
      updateData.date = admin.firestore.Timestamp.fromDate(eventDate);
    }

    await eventRef.update(updateData);
    
    return this.findById(id);
  }

  async delete(id) {
    const eventRef = db.collection('events').doc(id);
    const eventSnap = await eventRef.get();

    if (!eventSnap.exists) {
      throw new Error('Evento no encontrado');
    }

    await eventRef.delete();
    return true;
  }

  async findPopular(limit = 5) {
    const querySnapshot = await db.collection('events')
      .where('status', '==', 'active')
      .orderBy('participantsCount', 'desc')
      .limit(limit)
      .get();

    if (querySnapshot.empty) {
      return [];
    }

    return querySnapshot.docs.map(doc => Event.createFromDatabase(doc));
  }

  async findUpcoming(limit = 5) {
    const currentDate = admin.firestore.Timestamp.now();
    const querySnapshot = await db.collection('events')
      .where('date', '>=', currentDate)
      .orderBy('date', 'asc')
      .limit(limit)
      .get();

    if (querySnapshot.empty) {
      return [];
    }

    return querySnapshot.docs.map(doc => Event.createFromDatabase(doc));
  }

  async findByUser(uid, role) {
    if (role === 'ADMIN' || role === 'COORDINADOR') {
      const querySnapshot = await db.collection('events')
        .where('createdBy', '==', uid)
        .get();

      if (querySnapshot.empty) {
        return [];
      }

      return querySnapshot.docs.map(doc => Event.createFromDatabase(doc));
    }

    // For regular users, get events they're participating in
    const userEventsSnapshot = await db.collection('userEvents')
      .where('uid', '==', uid)
      .where('status', '==', 'active')
      .get();

    if (userEventsSnapshot.empty) {
      return [];
    }

    const eventIds = userEventsSnapshot.docs.map(doc => doc.data().idEvent);
    const events = [];

    // Process in chunks to avoid Firestore 'in' query limit
    const chunks = this.chunkArray(eventIds, 10);
    for (const chunk of chunks) {
      const eventsSnapshot = await db.collection('events')
        .where('__name__', 'in', chunk)
        .get();
      
      events.push(...eventsSnapshot.docs.map(doc => Event.createFromDatabase(doc)));
    }

    return events;
  }

  async addParticipant(eventId, userId) {
    const userEventRef = db.collection('userEvents').doc(`${userId}_${eventId}`);
    const userEventSnap = await userEventRef.get();

    if (userEventSnap.exists) {
      throw new Error('User already participating in this event');
    }

    // Add user-event relationship
    await userEventRef.set({
      uid: userId,
      idEvent: eventId,
      joinedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Add participant to event
    const eventRef = db.collection('events').doc(eventId);
    const participantRef = eventRef.collection('participants').doc(userId);

    await eventRef.update({
      participantsCount: admin.firestore.FieldValue.increment(1),
    });

    await participantRef.set({
      uid: userId,
      joinedAt: admin.firestore.FieldValue.serverTimestamp(),
      status: 'active',
    });
  }

  async removeParticipant(eventId, userId) {
    const userEventRef = db.collection('userEvents').doc(`${userId}_${eventId}`);
    const userEventSnap = await userEventRef.get();

    if (userEventSnap.exists) {
      await userEventRef.delete();

      const eventRef = db.collection('events').doc(eventId);
      const participantRef = eventRef.collection('participants').doc(userId);

      await eventRef.update({
        participantsCount: admin.firestore.FieldValue.increment(-1),
      });

      const participantSnap = await participantRef.get();
      if (participantSnap.exists) {
        await participantRef.delete();
      }
    }
  }

  async addFavorite(eventId, userId) {
    const favoriteRef = db.collection('userFavorites').doc(`${userId}_${eventId}`);
    const favoriteSnap = await favoriteRef.get();

    if (favoriteSnap.exists) {
      throw new Error('Event already in favorites');
    }

    // Add favorite relationship
    await favoriteRef.set({
      uid: userId,
      idEvent: eventId,
      favoriteAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Increment favorites count
    const eventRef = db.collection('events').doc(eventId);
    await eventRef.update({
      favoritesCount: admin.firestore.FieldValue.increment(1),
    });
  }

  async removeFavorite(eventId, userId) {
    const favoriteRef = db.collection('userFavorites').doc(`${userId}_${eventId}`);
    const favoriteSnap = await favoriteRef.get();

    if (favoriteSnap.exists) {
      await favoriteRef.delete();
    }

    // Decrement favorites count
    const eventRef = db.collection('events').doc(eventId);
    await eventRef.update({
      favoritesCount: admin.firestore.FieldValue.increment(-1),
    });
  }

  async findFavorites(userId) {
    const favoritesSnapshot = await db.collection('userFavorites')
      .where('uid', '==', userId)
      .get();

    if (favoritesSnapshot.empty) {
      return [];
    }

    const eventIds = favoritesSnapshot.docs.map(doc => doc.data().idEvent);
    const events = [];

    // Process in chunks
    const chunks = this.chunkArray(eventIds, 10);
    for (const chunk of chunks) {
      const eventsSnapshot = await db.collection('events')
        .where('__name__', 'in', chunk)
        .get();
      
      events.push(...eventsSnapshot.docs.map(doc => Event.createFromDatabase(doc)));
    }

    return events;
  }

  async findUserEvents(userId) {
    const userEventsSnapshot = await db.collection('userEvents')
      .where('uid', '==', userId)
      .get();

    if (userEventsSnapshot.empty) {
      return [];
    }

    const eventIds = userEventsSnapshot.docs.map(doc => doc.data().idEvent);
    const events = [];

    // Process in chunks
    const chunks = this.chunkArray(eventIds, 10);
    for (const chunk of chunks) {
      const eventsSnapshot = await db.collection('events')
        .where('__name__', 'in', chunk)
        .get();
      
      events.push(...eventsSnapshot.docs.map(doc => Event.createFromDatabase(doc)));
    }

    return events;
  }

  // Utility method
  chunkArray(array, size) {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  }
}

module.exports = FirebaseEventRepository;
