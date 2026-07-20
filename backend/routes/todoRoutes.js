const express = require('express');
const { postData, getAllData, deleteOneData, patchData } = require('../controllers/todoControllers');
const jwtAuth = require('../middlewares/jwtAuth');
const router = express.Router();


router.get('/',jwtAuth,getAllData)
router.post('/',jwtAuth,postData)
router.delete('/:id',jwtAuth,deleteOneData)
router.patch('/:id',jwtAuth,patchData)

module.exports = router