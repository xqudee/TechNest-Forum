
const Router = require('express')
const Authentication = require('../Controllers/authController')
const isUserAuth = require('../middleware/userAuthStatus')
const router = new Router()

const Auth = new Authentication()

router.post('/register', Auth.register)
router.post('/login', Auth.login)
router.post('/logout', Auth.logout)
router.post('/compare-passwords', Auth.comparePasswords)
router.post('/password-reset', Auth.passwordReset)
router.post('/password-reset/:confirm_token', Auth.confirmPasswordReset)
// router.get('/check-token/:token', Auth.checkToken)
router.post('/check-token/:refreshToken', Auth.refreshToken)

module.exports = router
