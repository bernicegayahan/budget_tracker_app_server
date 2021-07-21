const express = require('express');
//lets acquire the routing components of express
const router = express.Router();
const UserController = require('../controllers/user');
const auth = require('../auth');

//[Primary Routes]

//1. Register Route
router.post('/register', (req, res) => {
  UserController.register(req.body).then(result => res.send(result));
})

//2. Add Category Route
router.post('/add-category', auth.verify, (req, res) => {
  req.body.userId = auth.decode(req.headers.authorization).id
  UserController.addCategory(req.body).then(result => res.send(result));
})

//3. Login Route
router.post('/login', (req, res) => {
  UserController.login(req.body).then(result => res.send(result))
})

//google log in
/* router.post('/verify-google-id-token', async (req, res) => {
    res.send(await UserController.verifyGoogleTokenId(req.body.tokenId))
})
 */

//4. Email exists
router.post('/email-exists', (req, res) => {
  UserController.emailExists(req.body).then(result => res.send(result))
});

//5. Add Record Route
router.post('/add-record', auth.verify, (req, res) => {
  req.body.userId = auth.decode(req.headers.authorization).id
  UserController.addRecord(req.body).then(result => res.send(result));
})

//6. Retrieve categories
/* router.post('get-categories', auth.verify, (req, res) => {
    req.body.userId=  auth.decode(req.header.authorization).id
    UserController.getCategories(req.body).then(result => res.send(result));
}) */

//from group activity
router.get('/retrieveTransactions', auth.verify, (req, res) => {
  req.body.userId = auth.decode(req.header.authorization).id
  UserController.retrieveTransactions(req.body).then(result => res.json(result));
})

//to get category range breakdown
router.post('/get-records-breakdown-by-range', auth.verify, (req, res) => {
  req.body.userId = auth.decode(req.headers.authorization).id
  UserController.getRecordsBreakdownByRange(req.body).then(result => res.send(result))
})


//[Secondary Routes]
// getCategories
// post : request contains a body section
router.post('/get-categories', (req, res) => {
  req.body.userId = auth.decode(req.headers.authorization).id
  UserController.getCategories(req.body).then(result => res.json(result));
})

//get retrieve user.
router.get('/details', auth.verify, (req, res) => {
  const user = auth.decode(req.headers.authorization)
  UserController.get({ userId: user.id }).then(user => res.send(user))
})


module.exports = router;