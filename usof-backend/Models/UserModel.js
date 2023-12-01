const userStatusEnum = require('../Enums/userStatusEnum')
const db = require('../db')
const { generateHashedPassword } = require('../helpers/helperFunctions')

class User {
    constructor(login, password, name, email, avatar, rating, role) {
        this.login = login
        this.password = password
        this.name = name
        this.email = email
        this.avatar = avatar
        this.rating = rating
        this.role = role
    }

    addNew() {
        return db.execute(
            `INSERT INTO users (login, password, name, email, photo, rating, role) 
            VALUES ('${this.login}','${this.password}','${this.name}','${this.email}','${this.avatar}','${this.rating}','${this.role}');`
        )
    }

    getUsers() {
        return db.execute('SELECT * FROM users');
    }

    async getUserByLogin(login) {
        return db.execute(`SELECT * FROM users WHERE login="${login}";`)
    }

    async getUserByEmail(email) {
        return db.execute(`SELECT * FROM users WHERE email="${email}";`)
    }

    async getUserById(id) {
        return db.execute(`SELECT * FROM users WHERE id=${id};`)
    }

    async getAvatar(id) {
        return db.execute(`SELECT * FROM avatars WHERE user_id=${id};`)
    }

    async updateAvatar(data, id) {
        return db.execute(`UPDATE users set photo="${data}" WHERE id=${id};`)
    }

    async updateLogin(data, id) {
        return db.execute(`UPDATE users SET login='${data}' WHERE id=${id}`)
    }

    async updateAbout(data, id) {
        if (!data || !id) return;

        data = data.trim().replace(/'/g, "\\'");
        return db.execute(`UPDATE users SET about='${data}' WHERE id=${id}`)
    }

    async updateEmail(data, id) {
        return db.execute(`UPDATE users SET email='${data}' WHERE id=${id}`)
    }

    async updatePasswordByEmail(data, email) {
        const password = await generateHashedPassword(data)
        return db.execute(`UPDATE users SET password='${password}' WHERE email='${email}'`);
    }

    async updatePassword(data, id) {
        const password = await generateHashedPassword(data)
        return db.execute(`UPDATE users SET password='${password}' WHERE id=${id}`)
    }

    async updateFullName(data, id) {
        return db.execute(`UPDATE users SET name='${data}' WHERE id=${id}`)
    }

    async updateRole(data, id) {
        if (data !== userStatusEnum.USER && data !== userStatusEnum.ADMIN) return;
        
        return db.execute(`UPDATE users SET role='${data}' WHERE id=${id}`)
    }

    async deleteUser(id) {
        return db.execute(`DELETE FROM users WHERE id=${id};`)
    }

    async getBlockedPost(id) {
        return db.execute(
            `SELECT DISTINCT posts.*, posts.id as post_id, users.id as user_id, users.login, users.photo AS user_avatar
            FROM posts
            LEFT JOIN blockedposts ON posts.id = blockedposts.post_id
            LEFT JOIN users ON users.id = posts.user_id
            WHERE blockedposts.user_id = ${id};`
        )
    }

    async getUserFavoritesAuthors(userId) {
        return db.execute(
            `SELECT 
                users.id, 
                users.login, 
                users.photo,
                users.rating
            FROM favoriteauthors 
            LEFT JOIN users ON users.id = favoriteauthors.author_id
            WHERE favoriteauthors.user_id = "${userId}";`
        );
    }

    async getUserFollowers(userId) {
        return db.execute(
            `SELECT DISTINCT 
                users.*,
                favoriteauthors.author_id as author_id
            FROM favoriteauthors 
            LEFT JOIN users ON users.id = favoriteauthors.user_id
            WHERE favoriteauthors.author_id = "${userId}";`
        );
    }

    async getUserPosts(userId) {
        return db.execute(
            `SELECT DISTINCT users.login, posts.*
            FROM posts 
            LEFT JOIN users ON users.id = posts.user_id
            WHERE posts.user_id="${userId}";`
        );
    }

    async addAuthorToFavorite(user_id, author_id) {
        return db.execute(
            `INSERT INTO favoriteauthors (user_id, author_id) 
            VALUES ('${user_id}','${author_id}');`
        );
    }

    async checkUserFavoritesAuthors(user_id, author_id) {
        return db.execute(`SELECT * FROM favoriteauthors WHERE user_id="${user_id}" AND author_id="${author_id}";`);
    }

    async deleteAuthorFromFavorites(userId, author_id) {
        return db.execute(`DELETE FROM favoriteauthors WHERE author_id = ${author_id} AND user_id = ${userId};`);
    }

    async updateUserRating(user_id) {
        const likesCountFromPosts = await db.execute (
            `SELECT DISTINCT COUNT(*) as likeCount
            FROM users
            LEFT JOIN posts ON posts.user_id = users.id
            LEFT JOIN likeposts ON likeposts.post_id = posts.id
            WHERE users.id = ${user_id} AND likeposts.type = 'like';`
        )
        const dislikesCountFromPosts = await db.execute (
            `SELECT DISTINCT COUNT(*) as dislikeCount
            FROM users
            LEFT JOIN posts ON posts.user_id = users.id
            LEFT JOIN likeposts ON likeposts.post_id = posts.id
            WHERE users.id = ${user_id} AND likeposts.type = 'dislike';`
        )
        const likesCountFromComments = await db.execute (
            `SELECT DISTINCT COUNT(*) as likeCount
            FROM users
            LEFT JOIN comments ON comments.user_id = users.id
            LEFT JOIN likecomments ON likecomments.comment_id = comments.id
            WHERE users.id = ${user_id} AND likecomments.type = 'like';`
        )
        const dislikesCountFromComments = await db.execute (
            `SELECT DISTINCT COUNT(*) as dislikeCount
            FROM users
            LEFT JOIN comments ON comments.user_id = users.id
            LEFT JOIN likecomments ON likecomments.comment_id = comments.id
            WHERE users.id = ${user_id} AND likecomments.type = 'dislike';`
        )
        const rating = (likesCountFromPosts[0][0].likeCount + likesCountFromComments[0][0].likeCount) 
        - (dislikesCountFromPosts[0][0].dislikeCount + dislikesCountFromComments[0][0].dislikeCount);
        
        return db.execute(`UPDATE users SET rating=${rating} WHERE id=${user_id}`)
    }
}

module.exports = User;