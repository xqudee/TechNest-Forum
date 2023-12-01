const userStatusEnum = require('../Enums/userStatusEnum');
const db = require('../db');
const CategoryModel = require('./CategoryModel');

class Post {
    async createPost(user_id, title, content) {
        const type = "active";

        content = content?.trim().replace(/'/g, "\\'");
        
        return db.execute(
            `INSERT INTO posts (user_id, title, publish_date, type, content) 
            VALUES ('${user_id}','${title}',CURRENT_TIMESTAMP,'${type}', '${content}');`
        )
    }

    async createPostLike(user_id, post_id, type) {
        if (type !== 'like' && type !== 'dislike' && !user_id && !post_id) return;

        return db.execute(
            `INSERT INTO likeposts (user_id, post_id, type) 
            VALUES ('${user_id}','${post_id}','${type}');`
        )
    }

    async linkPostToCategories(postId, categoriesId) {
        return db.execute(`INSERT INTO post_categories (post_id, category_id) VALUES ('${postId}', '${categoriesId}')`);
    }

    async getAllPostsForGuest() {
        return db.execute(
            `SELECT 
                posts.id, posts.title, posts.content, posts.type, posts.rating, posts.user_id, posts.publish_date, posts.photo AS post_cover,
                users.login, users.name, users.photo AS user_avatar,
                GROUP_CONCAT(categories.title) AS post_categories
            FROM posts 
            LEFT JOIN users ON posts.user_id = users.id
            LEFT JOIN post_categories ON posts.id = post_categories.post_id
            LEFT JOIN categories ON post_categories.category_id = categories.id
            WHERE posts.type = 'active'
            GROUP BY posts.id`
        )
    }

    async getAllPosts(user_role, user_id, dateFilter, сategoryFilter) {
        let startDate, endDate;

        let whereString = "";
        let leftJoinString = "";

        if (user_role === userStatusEnum.GUEST) {
            whereString = 'posts.id'
        } else if (user_role === userStatusEnum.ADMIN) {
            leftJoinString = `LEFT JOIN blockedposts ON posts.id = blockedposts.post_id AND blockedposts.user_id = ${user_id}`
            whereString = 'blockedposts.post_id IS NULL'
        } else if (user_role !== userStatusEnum.GUEST) {
            leftJoinString = `LEFT JOIN blockedposts ON posts.id = blockedposts.post_id AND blockedposts.user_id = ${user_id}`
            whereString = `blockedposts.post_id IS NULL AND (posts.type = 'active' OR (posts.type = 'inactive' AND posts.user_id = '${user_id}'))`
        }

        if (dateFilter.length !== 0) {
            startDate = dateFilter[0];
            endDate = dateFilter[1];
            whereString += `
            AND (STR_TO_DATE(posts.publish_date, '%Y-%m-%d') >= STR_TO_DATE('${startDate}', '%d-%m-%Y')
            AND STR_TO_DATE(posts.publish_date, '%Y-%m-%d') <= STR_TO_DATE('${endDate}', '%d-%m-%Y'))`;
        }
        if (сategoryFilter.length !== 0) {
            сategoryFilter.forEach(category => {
                whereString += `
                AND (categories.title = '${category}')`
            });
        }

        return db.execute(
            `SELECT DISTINCT 
                posts.id, posts.title, posts.content, posts.type, posts.rating, posts.user_id, posts.publish_date, posts.photo AS post_cover,
                users.login, users.name, users.photo AS user_avatar,
                GROUP_CONCAT(categories.title) AS post_categories
            FROM posts
            LEFT JOIN users ON posts.user_id = users.id
            ${leftJoinString}
            LEFT JOIN likeposts ON posts.id = likeposts.post_id
            LEFT JOIN post_categories ON posts.id = post_categories.post_id
            LEFT JOIN categories ON post_categories.category_id = categories.id
            WHERE (${whereString})
            GROUP BY posts.id`
        )
    }

    async getPostById(id) {
        return db.execute(
            `SELECT DISTINCT 
                posts.id, posts.title, posts.content, posts.type, posts.rating, posts.user_id, posts.publish_date, posts.photo AS post_cover,
                users.login, users.name, users.photo AS user_avatar,
                GROUP_CONCAT(categories.title) AS post_categories
            FROM posts 
            LEFT JOIN users ON posts.user_id = users.id 
            LEFT JOIN post_categories ON posts.id = post_categories.post_id
            LEFT JOIN categories ON post_categories.category_id = categories.id
            WHERE posts.id = ${id}
            GROUP BY posts.id;`
        )
    }

    async getPostByName(title) {
        return db.execute(`
            SELECT posts.*, users.*, users.photo AS user_avatar,
            FROM posts
            LEFT JOIN users ON users.id = posts.user_id
            WHERE title="${title}";`); 
    }

    async getPostBySubstring(title) {
        return db.execute(`
            SELECT posts.*, posts.id as post_id, users.id as user_id, users.login,  users.photo AS user_avatar 
            FROM posts
            LEFT JOIN users ON users.id = posts.user_id
            WHERE title LIKE '%${title}%';`);
    }
    
    async getAllPostLikes(post_id) {
        return db.execute(
            `SELECT DISTINCT likeposts.id, likeposts.user_id, likeposts.post_id, likeposts.type, users.login
            FROM likeposts 
            LEFT JOIN users ON likeposts.user_id = users.id WHERE likeposts.post_id="${post_id}"`
        )
    }

    async updateTitle(data, post_id) {
        if (!data || !post_id) return;

        return db.execute(`UPDATE posts SET title='${data}' WHERE id=${post_id}`)
    }

    async updateContent(data, post_id) {
        if (!data || !post_id) return;

        data = data.trim().replace(/'/g, "\\'");
        return db.execute(`UPDATE posts SET content='${data}' WHERE id=${post_id}`)
    }

    async updateType(data, post_id) {
        if (!data || !post_id || (data != 'active' && data != 'inactive')) return;

        return db.execute(`UPDATE posts SET type='${data}' WHERE id=${post_id}`)
    }

    async deletePostLike(user_id, post_id) {
        return db.execute(`DELETE FROM likeposts WHERE post_id=${post_id} AND user_id=${user_id};`)
    }

    async updatePostRating(post_id) {
        const likesCount = await db.execute (
            `SELECT COUNT(*) as likeCount
            FROM likeposts
            WHERE post_id = ${post_id} AND type = 'like';`
        )
        const dislikesCount = await db.execute (
            `SELECT COUNT(*) as dislikeCount
            FROM likeposts
            WHERE post_id = ${post_id} AND type = 'dislike';`
        )
        const rating = likesCount[0][0].likeCount - dislikesCount[0][0].dislikeCount;

        return db.execute(`UPDATE posts SET rating=${rating} WHERE id=${post_id}`)
    }

    async deleteAllPostLikes(post_id) {
        return db.execute(`DELETE FROM likeposts WHERE post_id=${post_id};`)
    }

    async deletePost(post_id) {
        return db.execute(`DELETE FROM posts WHERE id=${post_id};`) 
    }

    async deleteCategoriesByPostId(post_id) {
        return db.execute(`DELETE FROM post_categories WHERE post_id=${post_id};`)
    }

    async deleteCategoriesFromPost(category_id) {
        return db.execute(`DELETE FROM post_categories WHERE category_id=${category_id};`)
    }

    async deleteAllCommentPostLikes(post_id) {
        db.execute(
            `DELETE FROM likecomments
            WHERE comment_id IN (SELECT id FROM comments WHERE post_id = ${post_id});`
        )
    }

    async blockPost(user_id, post_id) {
        return db.execute(
            `INSERT INTO blockedposts (user_id, post_id) 
            VALUES ('${user_id}','${post_id}');`
        );
    }

    async deleteBlockedPost(post_id) {
        return db.execute(`DELETE FROM blockedposts WHERE post_id = ${post_id});`)
    }

    async checkPostType(userId, postId) {
        return db.execute(`SELECT * FROM likeposts WHERE user_id="${userId}" AND post_id="${postId}";`);
    }

    async checkIsBlocked(userId, postId) {
        return db.execute(`SELECT * FROM blockedposts WHERE user_id="${userId}" AND post_id="${postId}";`);
    }

    async unblockPost(userId, postId) {
        return db.execute(`DELETE FROM blockedposts WHERE post_id = ${postId} AND user_id = ${userId};`);
    }

    async checkPostFavorites(userId, postId) {
        return db.execute(`SELECT * FROM favoriteposts WHERE user_id="${userId}" AND post_id="${postId}";`);
    }

    async getUserPostFavorites(userId) {
        return db.execute(
            `SELECT DISTINCT 
                posts.id as post_id, posts.title, posts.type, posts.publish_date,
                favoriteposts.user_id as user_id,
                users.id as author_id, users.login, users.name, users.photo AS user_avatar,
                GROUP_CONCAT(categories.title) AS post_categories
            FROM favoriteposts 
            LEFT JOIN posts ON posts.id = favoriteposts.post_id
            LEFT JOIN users ON users.id = posts.user_id
            LEFT JOIN post_categories ON post_categories.post_id = posts.id
            LEFT JOIN categories ON post_categories.category_id = categories.id
            WHERE favoriteposts.user_id=${userId}
            GROUP BY posts.id;`
        );

    }
    
    async getPostFavorites(postId) {
        return db.execute(
            `SELECT DISTINCT 
                posts.id as post_id, posts.title, 
                favoriteposts.user_id as user_id,
                users.id as author_id, users.login, users.name, users.photo AS user_avatar,
                GROUP_CONCAT(categories.title) AS post_categories
            FROM favoriteposts 
            LEFT JOIN posts ON posts.id = favoriteposts.post_id
            LEFT JOIN users ON users.id = posts.user_id
            LEFT JOIN post_categories ON post_categories.post_id = posts.id
            LEFT JOIN categories ON post_categories.category_id = categories.id
            WHERE favoriteposts.post_id=${postId}
            GROUP BY posts.id;`
        );

    }

    async addToFavorite(user_id, post_id) {
        return db.execute(
            `INSERT INTO favoriteposts (user_id, post_id) 
            VALUES ('${user_id}','${post_id}');`
        );
    }

    async deletePostFromFavorites(userId, postId) {
        return db.execute(`DELETE FROM favoriteposts WHERE post_id = ${postId} AND user_id = ${userId};`);
    }

    async updateCover(data, id) {
        return db.execute(`UPDATE posts SET photo="${data}" WHERE id=${id};`)
    }

    async deleteCover(postId) {
        return db.execute(`UPDATE posts SET photo=NULL WHERE id=${postId};`)
    }
}

module.exports = new Post();