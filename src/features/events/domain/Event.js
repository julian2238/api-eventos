class Event {
  constructor({
    id,
    title,
    description,
    category,
    date,
    hour,
    routes = [],
    createdBy,
    participantsCount = 0,
    favoritesCount = 0,
    status = 'active',
    createdAt = new Date(),
    updatedAt = new Date(),
  }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.category = category;
    this.date = date;
    this.hour = hour;
    this.routes = routes;
    this.createdBy = createdBy;
    this.participantsCount = participantsCount;
    this.favoritesCount = favoritesCount;
    this.status = status;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  // Business rules
  isActive() {
    return this.status === 'active';
  }

  isFinished() {
    return this.status === 'finished';
  }

  canBeModifiedBy(userId) {
    return this.createdBy === userId;
  }

  addParticipant() {
    this.participantsCount += 1;
  }

  removeParticipant() {
    if (this.participantsCount > 0) {
      this.participantsCount -= 1;
    }
  }

  addFavorite() {
    this.favoritesCount += 1;
  }

  removeFavorite() {
    if (this.favoritesCount > 0) {
      this.favoritesCount -= 1;
    }
  }

  // Factory methods
  static createFromDatabase(doc) {
    const data = doc.data();
    const dateObj = data.date.toDate();
    
    return new Event({
      id: doc.id,
      title: data.title,
      description: data.description,
      category: data.category,
      date: dateObj.toISOString().split('T')[0],
      hour: dateObj.toTimeString().split(' ')[0].slice(0, 5),
      routes: data.routes || [],
      createdBy: data.createdBy,
      participantsCount: data.participantsCount || 0,
      favoritesCount: data.favoritesCount || 0,
      status: data.status || 'active',
      createdAt: data.dtCreation?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    });
  }

  static createFromRequest(data, createdBy) {
    return new Event({
      title: data.title,
      description: data.description,
      category: data.category,
      date: data.date,
      hour: data.hour,
      routes: data.routes || [],
      createdBy,
    });
  }

  // Convert to plain object
  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      category: this.category,
      date: this.date,
      hour: this.hour,
      routes: this.routes,
      createdBy: this.createdBy,
      participantsCount: this.participantsCount,
      favoritesCount: this.favoritesCount,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  // Convert to public format (without sensitive data)
  toPublicJSON() {
    const event = this.toJSON();
    delete event.createdBy;
    return event;
  }
}

module.exports = Event;
