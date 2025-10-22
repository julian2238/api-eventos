class User {
  constructor({
    uid,
    document,
    fullName,
    email,
    phone,
    gender,
    birthDate,
    role = 'USUARIO',
    createdAt = new Date(),
    updatedAt = new Date(),
  }) {
    this.uid = uid;
    this.document = document;
    this.fullName = fullName;
    this.email = email;
    this.phone = phone;
    this.gender = gender;
    this.birthDate = birthDate;
    this.role = role;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  // Business rules
  isAdmin() {
    return this.role === 'ADMIN';
  }

  isCoordinator() {
    return this.role === 'COORDINADOR';
  }

  canAccessWeb() {
    return this.isAdmin() || this.isCoordinator();
  }

  // Factory methods
  static createFromFirebase(firebaseUser, additionalData) {
    return new User({
      uid: firebaseUser.uid,
      document: additionalData.document,
      fullName: additionalData.fullName,
      email: firebaseUser.email,
      phone: additionalData.phone,
      gender: additionalData.gender,
      birthDate: additionalData.birthDate,
      role: additionalData.role || 'USUARIO',
    });
  }

  static createFromDatabase(doc) {
    const data = doc.data();
    return new User({
      uid: doc.id,
      document: data.document,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      gender: data.gender,
      birthDate: data.birthDate,
      role: data.role,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }

  // Convert to plain object
  toJSON() {
    return {
      uid: this.uid,
      document: this.document,
      fullName: this.fullName,
      email: this.email,
      phone: this.phone,
      gender: this.gender,
      birthDate: this.birthDate,
      role: this.role,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  // Convert to public format (without sensitive data)
  toPublicJSON() {
    const user = this.toJSON();
    // Remove sensitive information for public responses
    return user;
  }
}

module.exports = User;
