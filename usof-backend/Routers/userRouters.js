const Router = require('express')
const adminRoleCheck = require('../middleware/roleCheck')
const user = require("../Controllers/userController")
const router = new Router()
const isAuth = require("../middleware/userAuthStatus")

router.get('/', user.getUsers)
router.get('/:user_id', user.getUserByID)
router.get('/:user_id/blocked_posts', isAuth(), user.getBlockedPost)
router.get('/:user_id/avatar', user.getAvatar)
router.post('/', adminRoleCheck('admin'), user.createUser)
router.patch('/:user_id/avatar', isAuth(), user.updateAvatar)
router.patch('/:user_id', isAuth(), user.updateUserData)
router.delete('/:user_id', isAuth(), user.deleteUser)

router.get('/:user_id/posts', user.getUserPosts);
router.get('/:user_id/favorite-users', isAuth(), user.getUserFavoriteAuthors);
router.get('/:user_id/followers', isAuth(), user.getUserFollowers);
router.post('/:author_id/favorite', isAuth(), user.addToFavorite);
router.delete('/:author_id/favorite', isAuth(), user.deleteFromFavorite);

module.exports = router