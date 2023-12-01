const Router = require('express');
const categories = require("../Controllers/categoryController");
const router = new Router();
const isAuth = require("../middleware/userAuthStatus");
const roleCheck = require("../middleware/roleCheck")

router.get('/', categories.getCategories);
router.get('/category', categories.getCategoryByName);
router.get('/:category_id', categories.getCategory);
router.get('/:category_id/posts', isAuth(), categories.getPostsByCategory);
router.post('/', roleCheck('admin'), categories.createCategory);
router.patch('/:category_id', roleCheck('admin'), categories.updateCategoryData);
router.delete('/:category_id', roleCheck('admin'), categories.deleteCategory);

router.get('/:user_id/pinned-categories', isAuth(), categories.getUserPinnedCategories);
router.post('/:category_id/pinned', isAuth(), categories.pinnedCategoryForUser);
router.delete('/:category_id/pinned', isAuth(), categories.deleteUserPinnedCategory);


module.exports = router;