//for ai agent


const express = require('express');
const { postData } = require('../controllers/agentControllers.js');
const jwtAuth = require('../middlewares/jwtAuth.js');
const agentRoutes = express.Router();

agentRoutes.post('/',jwtAuth,postData)

module.exports = agentRoutes