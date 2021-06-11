const express = require('express');
//lets acquire the routing components of express
const router = express.Router();
const UserController = require('../controllers/user');


//[Primary Routes]

//1. Register Route
router.post('/register', (req, res) => {
   UserController.register(req.body).then(result => res.send(result));
})

//2. Add Category Route
router.post('/add-category', (req, res) => {
    UserController.addCategory(req.body).then(result => res.send(result));
})


//[Secondary Routes]


module.exports = router; 