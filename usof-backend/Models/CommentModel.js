const db = require('../db')

class Comment {
    async createComment(content, user_id, post_id) {
        if (!content || !user_id || !post_id) return;

        return db.execute(
            `INSERT INTO comments (user_id, content, post_id) 
            VALUES ('${user_id}','${content}','${post_id}');`
        )
    }

    async getCommentById(id) {
        return db.execute(`
            SELECT comments.*, users.login as user_login
            FROM comments 
            LEFT JOIN users ON users.id = comments.user_id
            WHERE comments.id="${id}";
        `);
    }

    async getCommentByPostId(postId) {
        return db.execute(`
            SELECT comments.*, users.login as user_login
            FROM comments 
            LEFT JOIN users ON users.id = comments.user_id
            WHERE post_id="${postId}";`);
    }

    async getCommentByContent(content) {
        return db.execute(`SELECT * FROM categories WHERE content="${content}";`);
    }

    async getCommentLikes(commentId) {
        return db.execute(`SELECT * FROM likecomments WHERE comment_id="${commentId}";`);
    }

    async createCommentLike(userId, commentId, type) {
        if (type != 'like' && type != 'dislike') return;
 
        return db.execute(
            `INSERT INTO likecomments (user_id, comment_id, type)
            VALUES ('${userId}','${commentId}','${type}');`
        );
    }

    async updateContent(data, comment_id) {
        return db.execute(`UPDATE comments SET content='${data}' WHERE id=${comment_id}`)
    }

    async deleteComment(commentId) {
        return db.execute(`DELETE FROM comments WHERE id="${commentId}"`)
    }

    async deleteCommentLike(userId, commentId) {
        return db.execute(`DELETE FROM likecomments WHERE user_id="${userId}" AND comment_id="${commentId}"`)
    }

    async deleteAllCommentLikes(commentId) {
        return db.execute(`DELETE FROM likecomments WHERE comment_id="${commentId}"`)
    }

    async deleteAllCommentsUnderPost(postId) {
        return db.execute(`DELETE FROM comments WHERE post_id="${postId}"`)
    }

    async checkCommentType(userId, commentId) {
        return db.execute(`SELECT * FROM likecomments WHERE user_id="${userId}" AND comment_id="${commentId}";`);
    }
}

module.exports = new Comment();