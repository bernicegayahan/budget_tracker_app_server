const jwt = require('jsonwebtoken');
const secret = 'BudgetTrackingAPI';


//I want to acccess and parse data from the .env module
require('dotenv').config()

//const secretWord = process.env.secret;

//CREATE a function to generate an access token for user authentication.
module.exports.createAccessToken = (user) => {
   //we will identify the props/keys of the user that we want to verify 
   const data = {
      id: user._id,
      email: user.email,
      //isAdmin: user.isAdmin
   }

   return jwt.sign(data, secret, {})
}
//lets replicate the verify method to validate if the access token generated has been sent and receieved from the correct client. 
module.exports.verify = (req, res, next) => {
   let token = req.headers.authorization

   if (typeof token !== 'undefined') {

      token = token.slice(7, token.length)

      return jwt.verify(token, secret, (err, data) => {
         return err ? res.send({ auth: 'failed' }) : next()
      })

   } else {
      return res.send({ auth: 'failed' })
   }
}

//decode function which will allow us to verify the token generated. 
module.exports.decode = (token) => {
   //lets create a control structure to determine the response if an access token is captured.
   if (typeof token !== 'undefined') {

      token = token.slice(7, token.length)

      return jwt.verify(token, secret, (err, data) => {
         return err ? null : jwt.decode(token, { complete: true }).payload
      })

   } else {
      return null
   }
}
