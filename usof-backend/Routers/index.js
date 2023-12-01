const Router = require('express')

const authorizationRoutes = require('./authRouters')
const userRouters = require('./userRouters')
const postRouters = require('./postRouters')
const categoriesRouters = require('./categoriesRouters')
const commentsRouters = require('./commentRouters')
const Authentication = require('../Controllers/authController')

const Auth = new Authentication()
const router = new Router()

router.use('/api/auth', authorizationRoutes)
router.use('/api/users', userRouters)
router.use('/api/posts', postRouters)
router.use('/api/categories', categoriesRouters)
router.use('/api/comments', commentsRouters)
router.get('/api/check-token', Auth.isToken)

module.exports = router