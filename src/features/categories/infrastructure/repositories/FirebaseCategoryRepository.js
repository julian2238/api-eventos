const { db } = require('../../../../shared/database/firebase');
const Category = require('../../domain/Category');

class FirebaseCategoryRepository {
  async create(category) {
    const categoryData = {
      name: category.name,
      description: category.description,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const categoryRef = await db.collection('categories').add(categoryData);
    
    return new Category({
      id: categoryRef.id,
      ...categoryData,
    });
  }

  async findById(id) {
    const categoryDoc = await db.collection('categories').doc(id).get();
    
    if (!categoryDoc.exists) {
      return null;
    }

    return Category.createFromDatabase(categoryDoc);
  }

  async findAll() {
    const categoriesSnapshot = await db.collection('categories').get();
    
    if (categoriesSnapshot.empty) {
      return [];
    }

    return categoriesSnapshot.docs.map(doc => Category.createFromDatabase(doc));
  }

  async update(id, categoryData) {
    const updateData = {
      ...categoryData,
      updatedAt: new Date(),
    };

    await db.collection('categories').doc(id).update(updateData);
    
    return this.findById(id);
  }

  async delete(id) {
    await db.collection('categories').doc(id).delete();
    return true;
  }
}

module.exports = FirebaseCategoryRepository;
