const Router = require('express');
const post = require("../Controllers/postController");
const router = new Router();
const isAuth = require("../middleware/userAuthStatus");

router.get('/', post.getPosts);
router.post('/', isAuth(), post.createPost);

router.get('/post', post.getPostByName);

router.get('/:post_id', post.getPost);
router.patch('/:post_id', isAuth(), post.updatePost);
router.delete('/:post_id', isAuth(), post.deletePost);

router.get('/:post_id/categories', post.getPostCategories);

router.get('/:post_id/comments', post.getPostComments);
router.post('/:post_id/comments', isAuth(), post.createPostComment);

router.get('/:post_id/like', post.getPostLikes);
router.post('/:post_id/like', isAuth(), post.createPostLike);
router.delete('/:post_id/like', isAuth(), post.deletePostLike);

router.get('/:user_id/favorite-posts', isAuth(), post.getUserFavoritePosts);
router.get('/:post_id/favorite', isAuth(), post.getPostFavorites);
router.post('/:post_id/favorite', isAuth(), post.addToFavorite);
router.delete('/:post_id/favorite', isAuth(), post.deleteFromFavorite);

router.get('/:post_id/block', isAuth(), post.getBlockedPost)
router.post('/:post_id/block', isAuth(), post.blockPost)

router.patch('/:post_id/cover', isAuth(), post.updateCover)
router.delete('/:post_id/cover', isAuth(), post.deleteCover)

module.exports = router;