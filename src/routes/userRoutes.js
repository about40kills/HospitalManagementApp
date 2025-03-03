const express = require('express');
const router = express.Router();
const validateToken = require('../middleware/validateTokenMiddleware');
const {registerUser, loginUser, getUserProfile, updateUserRole} = require('../controllers/userController');

//register a user
router.post('/register', registerUser);

//login a user
router.post('/login', loginUser);

//get user profile
router.get('/:id', validateToken, getUserProfile);

//update user role
router.put('/:id/role', validateToken, updateUserRole);

module.exports = router;