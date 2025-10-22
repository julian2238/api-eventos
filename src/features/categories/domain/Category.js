class Category {
  constructor({
    id,
    name,
    description,
    createdAt = new Date(),
    updatedAt = new Date(),
  }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  // Business rules
  isValid() {
    return this.name && this.name.length >= 2;
  }

  // Factory methods
  static createFromDatabase(doc) {
    const data = doc.data();
    return new Category({
      id: doc.id,
      name: data.name,
      description: data.description,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }

  static createFromRequest(data) {
    return new Category({
      name: data.name,
      description: data.description,
    });
  }

  // Convert to plain object
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

module.exports = Category;
