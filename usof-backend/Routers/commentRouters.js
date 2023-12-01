const Router = require('express');
const comments = require("../Controllers/commentController");
const router = new Router();
const isAuth = require("../middleware/userAuthStatus");
const roleCheck = require("../middleware/roleCheck");

router.get('/:comment_id', comments.getComment);
router.get('/:comment_id/like', comments.getCommentLikes);
router.post('/:comment_id/like', isAuth(), comments.createCommentLike);
router.patch('/:comment_id', isAuth(), comments.updateComment);
router.delete('/:comment_id', isAuth(), comments.deleteComment);
router.delete('/:comment_id/like', isAuth(), comments.deleteCommentLike);

module.exports = router;