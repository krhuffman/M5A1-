const express = require('express');
const router = express.Router();
const authenticationController = require('../controllers/authenticationController');

router.route('/signup')
    .get(authenticationController.register)
    .post(authenticationController.signUp)

router.route('/login')
    .post(authenticationController.login)

router.route('/logout')
    .get(authenticationController.logout)


module.exports = router;