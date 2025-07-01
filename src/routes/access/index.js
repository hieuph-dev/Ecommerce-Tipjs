// Định nghĩa các endpoint (/shop/signup, /shop/login, /shop/logout).
'use strict';

const express = require('express')
const accessController = require('../../controllers/accessController');
const { authentication, authenticationV2 } = require('../../auth/authUtils');
const asyncHandler = require('../../helpers/asyncHandler');
const router = express.Router()

// Sign up 
router.post('/shop/signup', asyncHandler(accessController.signUp))

// Login
router.post('/shop/login', asyncHandler(accessController.login))

// Authentication
router.use(authenticationV2)
// Logout
router.post('/shop/logout', asyncHandler(accessController.logout))
router.post('/shop/handlerRefreshToken', asyncHandler(accessController.handlerRefreshToken))



module.exports = router
