const express = require('express');
//lets acquire the routing components of express
const router = express.Router();
const UserController = require('../controllers/user');
const auth = require('../auth')

//[Primary Routes]

//1. Register Route
router.post('/register', (req, res) => {
   UserController.register(req.body).then(result => res.send(result));
})

//login user
router.post('/login', (req, res) => {
    UserController.login(req.body).then(result => res.send(result));
})

//2. Add Category Route
router.post('/add-category', auth.verify, (req, res) => {
	req.body.userId = auth.decode(req.headers.authorization).id
    UserController.addCategory(req.body).then(result => res.send(result));
})

//3. Add Record Route
router.post('/add-record', auth.verify ,(req, res) => {
   req.body.userId = auth.decode(req.headers.authorization).id
   UserController.addRecord(req.body).then(result => res.send(result)); 
})


//[Secondary Routes]


module.exports = router; 