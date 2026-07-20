const express = require('express');
const { signup, login, logout } = require('../controllers/userControllers');
const jwtAuth = require('../middlewares/jwtAuth');
const userRoutes = express.Router();

userRoutes.post('/',signup)
userRoutes.post('/login',login)
userRoutes.post('/logout',logout)

module.exports = userRoutes