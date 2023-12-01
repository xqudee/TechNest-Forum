const db = require('../db')

class Category {

    async createCategory(title, description) {
        if (description == null) description = "";

        return db.execute(
            `INSERT INTO categories (title, description) 
            VALUES ('${title}','${description}');`
        )
    }

    async getAllCategories() {
        return db.execute(`SELECT * FROM categories WHERE title != 'Uncategorized'`);
    }

    async getCategoryById(id) {
        return db.execute(`SELECT * FROM categories WHERE id="${id}";`);
    }

    async getCategoryByName(title) {
        return db.execute(`SELECT * FROM categories WHERE title="${title}";`); 
    }

    async getCategoryBySubstring(title) {
        return db.execute(`SELECT * FROM categories WHERE title LIKE '%${title}%';`);
    }

    async getCategoriesByPostId(postId) {
        return db.execute(
            `SELECT DISTINCT * FROM post_categories 
            LEFT JOIN categories ON post_categories.category_id = categories.id 
            WHERE post_id="${postId}";`
        );
    }

    async getPostsByCategory(category_id) {
        return db.execute(
            `SELECT posts.*, posts.id as post_id, users.id as user_id, users.login, users.photo AS user_avatar
            FROM posts
            LEFT JOIN post_categories ON posts.id = post_categories.post_id 
            LEFT JOIN users ON users.id = posts.user_id
            WHERE post_categories.category_id="${category_id}";`
        );
    }

    async updateTitle(data, category_id) {
        if (!data || !category_id) return;

        return db.execute(`UPDATE categories SET title='${data}' WHERE id=${category_id}`)
    }

    async updateDescription(data, category_id) {
        if (!data || !category_id) return;

        return db.execute(`UPDATE categories SET description='${data}' WHERE id=${category_id}`)
    }

    async deleteCategory(category_id) {
        if (!category_id) return;

        return db.execute(`DELETE FROM categories WHERE id='${category_id}'`)
    }

    async getUserPinnedCategories(user_id) {
        return db.execute(
            `SELECT DISTINCT categories.id as category_id, categories.title, categories.description
            FROM pinnedcategories 
            LEFT JOIN categories ON categories.id = pinnedcategories.category_id
            WHERE pinnedcategories.user_id="${user_id}";`
        );
    }

    async checkPinnedCategoryForUser(userId, categoryId) {
        return db.execute(`SELECT * FROM pinnedcategories WHERE user_id="${userId}" AND category_id="${categoryId}";`);
    }

    async pinnedCategoryForUser(user_id, category_id) {
        return db.execute(
            `INSERT INTO pinnedcategories (user_id, category_id) 
            VALUES ('${user_id}','${category_id}');`
        );
    }

    async deleteCategoryFromPinned(userId, category_id) {
        return db.execute(`DELETE FROM pinnedcategories WHERE category_id = ${category_id} AND user_id = ${userId};`);
    }
}

module.exports = new Category();