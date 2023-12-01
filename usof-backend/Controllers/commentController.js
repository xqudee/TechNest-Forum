const CommentModel = require('../Models/CommentModel');
const PostModel = require('../Models/PostModel');
const { getAuthUserInfo } = require('../helpers/helperFunctions');
const User = require('../models/userModel');

class CommentController {
    async getComment(req, res) {
        const { comment_id } = req.params;

        CommentModel.getCommentById(comment_id)
        .then(resp => {
            if (resp[0].length > 0) {
                return res.status(200).json({ message: "Comment", data: resp[0] })
            } else {
                return res.status(404).json({ message: "Comment not found" });
            }
        })
        .catch(error => { return res.status(404).json({ Error: error.message }) });
    }

    async getCommentLikes(req, res) {
        const { comment_id } = req.params;

        CommentModel.getCommentLikes(comment_id)
        .then(resp => {
            if (resp[0].length > 0) {
                return res.status(200).json({ message: "Comment likes", data: resp[0] })
            } else {
                return res.status(404).json({ message: "Comment likes not found" });
            }
        })
        .catch(error => { return res.status(404).json({ Error: error.message }) });
    }

    async createCommentLike(req, res) {
        const { comment_id } = req.params;
        const { type } = req.body;
        const { user_decoded_id } = getAuthUserInfo(req);

        if (type != 'dislike' && type != 'like') {
            return res.status(404).json({ error: "Invalid type" })
        }


        CommentModel.checkCommentType(user_decoded_id, comment_id)
        .then(async resp => {
            let updated = false;
            let message = "no errors";
            let oldCommentType = "";

            const user = new User();
            const commentInfo = await CommentModel.getCommentById(comment_id);
            const authorId = commentInfo[0][0].user_id;

            if (resp[0][0] != null) {
                oldCommentType = resp[0][0].type;

                const delResponse = await CommentModel.deleteCommentLike(user_decoded_id, comment_id);
                if (delResponse) {
                    updated = true
                } else {
                    message = "Comment wasn't unliked";
                }
            } 
            if (oldCommentType === type) {
                const userRatingResp = await user.updateUserRating(authorId);
                if (userRatingResp) res.status(200).json({ message: "Unliked", data: resp[0] })
            } else {
                const commentResponse = await CommentModel.createCommentLike(user_decoded_id, comment_id, type);
                if (commentResponse) { 
                    try {
                        const userRatingResp = await user.updateUserRating(authorId);
                        message = "Like"
                        if (userRatingResp) updated = true;
                    } catch (error) {
                        console.log(error);
                    }
                } else {
                    message = "Comment wasn't liked"
                }

                if (updated) {
                    return res.status(200).json({ message: message, data: commentResponse[0] })
                } else {
                    return res.status(404).json({ error: message })
                }
            }
        })
        .catch(error => { return res.status(404).json({ Error: "Comment not found" }) });

    }

    async updateComment(req, res) {
        const { comment_id } = req.params;
        const { content } = req.body;

        if (!content) {
            return res.status(404).json({ message: "Fill in the content of the comment" });
        }

        const { user_decoded_id } = getAuthUserInfo(req);
        const commentAuthor = await CommentModel.getCommentById(comment_id);
        if (commentAuthor[0].length === 0) {
            return res.status(404).json({ message: "Comment not found" });
        }
        const authorId = commentAuthor[0][0].user_id;

        if (user_decoded_id != authorId) {
            return res.status(403).json({ message: "Access error. You can't edit comment if you are not the author" });
        }

        CommentModel.updateContent(content, comment_id)
        .then(resp => {
            if (resp[0].affectedRows > 0) {
                return res.status(200).json({ message: "Comment was updated", data: resp[0] })
            } else {
                return res.status(404).json({ message: "Error updated comment" });
            }
        })
        .catch(error => { return res.status(404).json({ Error: error.message }) });
    }

    async deleteComment(req, res) {
        const { comment_id } = req.params;

        const { user_decoded_id, user_decoded_role } = getAuthUserInfo(req);
        const commentAuthor = await CommentModel.getCommentById(comment_id);
        if (commentAuthor[0].length === 0) {
            return res.status(404).json({ message: "Comment not found" });
        }
        const authorId = commentAuthor[0][0].user_id;

        if (user_decoded_id === authorId || user_decoded_role === userStatusEnum.ADMIN) {
            CommentModel.deleteAllCommentLikes(comment_id)
            .then(() => {
                CommentModel.deleteComment(comment_id)
                .then(resp => {
                    if (resp[0].affectedRows > 0) {
                        return res.status(200).json({ message: "Comment was deleted", data: resp[0] })
                    } else {
                        return res.status(404).json({ message: "Error deleted comment" });
                    }
                })
                .catch(error => { return res.status(404).json({ Error: error.message }) });
            }).catch(error => { return res.status(404).json({ Error: error.message }) });
        } else {
            return res.status(403).json({ message: "Access error. You are not author or admin" });
        }
    }

    async deleteCommentLike(req, res) {
        const { comment_id } = req.params;

        const { user_decoded_id } = getAuthUserInfo(req);
        const commentAuthor = await CommentModel.getCommentById(comment_id);
        if (commentAuthor[0].length === 0) {
            return res.status(404).json({ message: "Comment not found" });
        }
        const authorId = commentAuthor[0][0].user_id;

        if (user_decoded_id === authorId) {
            CommentModel.deleteCommentLike(authorId, comment_id)
            .then(resp => {
                if (resp[0].length > 0) {
                    return res.status(200).json({ message: "Comment like was deleted", data: resp[0] })
                } else {
                    return res.status(404).json({ message: "Comment like not found" });
                }
            })
            .catch(error => { return res.status(404).json({ Error: error.message }) });
        } else {
            return res.status(403).json({ message: "Access error. You are not author" });
        }
    }
}

module.exports = new CommentController();