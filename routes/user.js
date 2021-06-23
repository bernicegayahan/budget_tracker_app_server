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

//4. retrieve categories
//we will use post because this request would contain a body section.
router.post('get-categories', auth.verify ,(req, res) => {
    req.body.userId = auth.decode(req.headers.authorization).id
    UserController.getCategories(req.body).then(result => res.send(result)); 
}) 





//[Secondary Routes]

//get retrieve user.
router.get('/details', auth.verify, (req, res) => {
  const user = auth.decode(req.headers.authorization)
   UserController.get({ userId: user.id }).then(user => res.send(user))
})


module.exports = router; 